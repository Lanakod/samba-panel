import fs from 'node:fs'
import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {env} from '@/env';
import {dockerClient, execInContainer, getSingleUser, handleApiError, requireAuth} from '@/lib';
import {Writable} from 'node:stream';
import {CreateUserSchema, DeleteUserSchema, UpdateUserSchema} from "@/schemas";

// Timeout wrapper
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Operation timed out after ${ms}ms`));
        }, ms);

        promise.then(
            (value) => {
                clearTimeout(timer);
                resolve(value);
            },
            (error) => {
                clearTimeout(timer);
                reject(error);
            }
        );
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {username, password} = CreateUserSchema.parse(body)

        const container = dockerClient.getContainer(env.CONTAINER_NAME);

        await withTimeout(new Promise<void>(async (resolve, reject) => {
            // Step 2: Set Samba password using shell pipe
            const sambaPasswordExec = await container.exec({
                Cmd: [
                    "bash", "-c", `/usr/bin/samba.sh -u '${username};${password}'`
                ],
                AttachStdout: true,
                AttachStderr: true,
                Tty: false,
            });

            sambaPasswordExec.start({}, (err, stream) => {
                if (err) return reject(err);

                let errOut = '';

                const stderr = new Writable({
                    write(chunk, encoding, callback) {
                        errOut += chunk.toString();
                        callback();
                    }
                });

                const stdout = new Writable({
                    write(chunk, encoding, callback) {
                        callback();
                    }
                });

                container.modem.demuxStream(stream, stdout, stderr);

                if (stream) {
                    stream.on('end', () => {
                        if (errOut) {
                            return reject(new Error(`Failed to set Samba password: ${errOut}`));
                        }
                        resolve();
                    });

                    stream.on('error', (e) => {
                        reject(e);
                    });
                }
            });
        }), 10000);

        const user = await getSingleUser(container, username)
        if (!user)
            return NextResponse.json({
                status: false,
                error: "User not found after creating"
            })

        return NextResponse.json({
            status: true,
            message: 'User created successfully',
            user
        });
    } catch (e) {
        const {status, message, error} = handleApiError(e)
        return NextResponse.json({
            status: false,
            message,
            error
        }, {status})
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const {username, password} = UpdateUserSchema.parse(body)

        const container = dockerClient.getContainer(env.CONTAINER_NAME);

        await withTimeout(new Promise<void>(async (resolve, reject) => {
            const exec = await container.exec({
                Cmd: ["bash", "-c", `/usr/bin/samba.sh -u '${username};${password}'`],
                AttachStdout: true,
                AttachStderr: true,
                Tty: false,
            });

            exec.start({}, (err, stream) => {
                if (err) return reject(err);

                let errorOutput = '';

                const stderr = new Writable({
                    write(chunk, encoding, callback) {
                        errorOutput += chunk.toString();
                        callback();
                    }
                });

                const stdout = new Writable({
                    write(_chunk, _encoding, callback) {
                        callback();
                    }
                });

                container.modem.demuxStream(stream, stdout, stderr);

                if (stream) {
                    stream.on('end', () => {
                        if (errorOutput) {
                            return reject(new Error(errorOutput));
                        }
                        resolve();
                    });

                    stream.on('error', reject);
                }
            });
        }), 10000);
        const user = await getSingleUser(container, username)
        if (!user)
            return NextResponse.json({
                status: false,
                error: "User not found after creating"
            })
        return NextResponse.json({
            status: true,
            message: 'Password updated successfully',
            user
        });
    } catch (e) {
        const {status, message, error} = handleApiError(e)
        return NextResponse.json({
            status: false,
            message,
            error
        }, {status})
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json()
        const {username} = DeleteUserSchema.parse(body)

        // Step 1: Delete user from Samba database using pdbedit
        const container = dockerClient.getContainer(env.CONTAINER_NAME);
        const {error} = await execInContainer(container, [
            'pdbedit',
            '-x',
            '-u',
            username,
            '-s',
            '/etc/samba/smb.conf',
        ]);

        if (error) {
            return NextResponse.json({
                status: false,
                error: `Failed to delete user with pdbedit: ${error}`
            }, {status: 500});
        }

        // Step 2: Remove user from smbpasswd file
        const content = fs.readFileSync(env.SMBPASSWD_PATH, 'utf-8');

        const filtered = content
            .split('\n')
            .filter(line => !line.startsWith(`${username}:`))
            .join('\n');

        fs.writeFileSync(env.SMBPASSWD_PATH, filtered, 'utf-8');

        return NextResponse.json({status: true, message: `User ${username} removed`});

    } catch (e) {
        const {status, message, error} = handleApiError(e)
        return NextResponse.json({
            status: false,
            message,
            error
        }, {status})
    }
}

export async function GET() {
    try {
        await requireAuth()
        const container = dockerClient.getContainer(env.CONTAINER_NAME)
        const {output, error} = await execInContainer(container, ["pdbedit", "-L"])
        if (error) {
            return NextResponse.json({status: false, error}, {status: 500})
        }
        const users = output
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                const [username, uid, type] = line.split(':');
                return {username, uid, type};
            })
        return NextResponse.json({
            status: true,
            users
        })
    } catch (e) {
        const {status, message, error} = handleApiError(e)
        return NextResponse.json({
            status: false,
            message,
            error
        }, {status})
    }
}

