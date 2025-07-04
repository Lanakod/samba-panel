import Docker from 'dockerode'

export const dockerClient = new Docker({
    socketPath: '/var/run/docker.sock'
})