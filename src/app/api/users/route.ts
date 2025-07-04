import fs from 'node:fs'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/env';
import { dockerClient, execInContainer, getSingleUser } from '@/utils';
import { Writable } from 'node:stream';

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
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }

  try {
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

    if(stream){
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
    if(!user)
      return NextResponse.json({
        status: false,
        error: "User not found after creating"
      })

    return NextResponse.json({ 
      status: true,
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }

  try {
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

        if(stream) {
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
    if(!user)
      return NextResponse.json({
        status: false,
        error: "User not found after creating"
      })
    return NextResponse.json({
      status: true,
      message: 'Password updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ status: false, error: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { username } = await request.json();

  if (!username) {
    return NextResponse.json({ status: false, error: 'Username is required' }, { status: 400 });
  }

  try {
    // Step 1: Delete user from Samba database using pdbedit
    const container = dockerClient.getContainer(env.CONTAINER_NAME);
    const { error } = await execInContainer(container, [
      'pdbedit',
      '-x',
      '-u',
      username,
      '-s',
      '/etc/samba/smb.conf',
    ]);

    if (error) {
      return NextResponse.json({ status: false, error: `Failed to delete user with pdbedit: ${error}` }, {status: 500});
    }

    // Step 2: Remove user from smbpasswd file
    const content = fs.readFileSync(env.SMBPASSWD_PATH, 'utf-8');

    const filtered = content
      .split('\n')
      .filter(line => !line.startsWith(`${username}:`))
      .join('\n');

    fs.writeFileSync(env.SMBPASSWD_PATH, filtered, 'utf-8');

    return NextResponse.json({ status: true, message: `User ${username} removed` });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: false, error: 'Unexpected error while deleting user' }, {status: 500});
  }
}

export async function GET() {
    const container = dockerClient.getContainer(env.CONTAINER_NAME)
    const {output, error} = await execInContainer(container, ["pdbedit", "-L"])
    if(error) {
        return NextResponse.json({status: false, error}, {status: 500})
    }
    const users = output
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [username, uid, type] = line.split(':');
        return { username, uid, type };
      })
    return NextResponse.json({
      status: true,
      users
    })
}