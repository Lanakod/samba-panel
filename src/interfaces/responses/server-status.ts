export interface IDockerStats {
    cpuPercent: number;
    memUsageMB: number;
    memLimitMB: number;
    memPercent: number;
}

export type ContainerStatus = 'running' | 'stopped' | 'restarting' | 'fetching'

type ServerRunning = {
    state: ContainerStatus,
    cpuPercent: number;
    memUsageMB: number;
    memLimitMB: number;
    memPercent: number;
    time: string
}

type ServerStopped = {
    state: "stopped" | "restarting" | 'fetching',
    time: string
}

export type GetServerStatusResponse = ServerRunning | ServerStopped


