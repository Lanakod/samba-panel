export interface IDockerStats {
    cpuPercent: number;
    memUsageMB: number;
    memLimitMB: number;
    memPercent: number;
}

export type ContainerStatus = 'running' | 'stopped' | 'restarting' | 'fetching'

type ServerRunning = {
    type: 'status',
    state: ContainerStatus,
    cpuPercent: number;
    memUsageMB: number;
    memLimitMB: number;
    memPercent: number;
    time: string
}

type ServerStopped = {
    type: 'status',
    state: "stopped" | "restarting" | 'fetching',
    time: string
}

export type GetServerStatusResponse = ServerRunning | ServerStopped


export type GetServerLogsResponse = {
    type: 'log',
    data: string,
    time: string
}