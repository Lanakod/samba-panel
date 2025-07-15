import {IUser} from "@/interfaces";
import {Container} from "dockerode";
import {Writable} from "stream";

export async function execInContainer(
    container: Container,
    cmd: string[]
): Promise<{ output: string; error?: string }> {
    const exec = await container.exec({
        Cmd: cmd,
        AttachStdout: true,
        AttachStderr: true,
    });
    return new Promise((resolve, reject) => {
        let output = '';
        let errorOutput = '';

        exec.start({}, (err, stream) => {
            if (err) return reject(err);

            const stdout = new Writable({
                write(chunk, encoding, callback) {
                    output += chunk.toString();
                    callback();
                }
            });

            const stderr = new Writable({
                write(chunk, encoding, callback) {
                    errorOutput += chunk.toString();
                    callback();
                }
            });

            container.modem.demuxStream(stream, stdout, stderr);

            if (stream) {
                stream.on('end', () => {
                    resolve({
                        output: output.trim(),
                        error: errorOutput.trim() || undefined,
                    });
                });

                stream.on('error', reject);
            }
        });
    });
}


export async function getSingleUser(container: Container, username: string): Promise<IUser | null> {
    const {output, error} = await execInContainer(container, ["pdbedit", "-L", username])
    if (error) return null
    const [_username, uid, type] = output.split(':')
    return {username: _username, uid, type}
}