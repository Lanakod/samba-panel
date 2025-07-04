import { ContainerStats } from "dockerode";

export function parseDockerStats(stats: ContainerStats): {
  cpuPercent: number;
  memUsageMB: number;
  memLimitMB: number;
  memPercent: number;
} {
    const {cpu_stats, precpu_stats, memory_stats} = stats

  const cpuDelta =
    cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage;
  const systemDelta =
    cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage;
  const online_cpus = cpu_stats.online_cpus;

  let cpuPercent = 0;
  if (systemDelta > 0 && cpuDelta > 0) {
    cpuPercent = Number(((cpuDelta / systemDelta) * online_cpus * 100).toFixed(2));
  }

  const memUsageMB = Number((memory_stats.usage / (1024 * 1024)).toFixed(2));
  const memLimitMB = Number((memory_stats.limit / (1024 * 1024)).toFixed(2));
  const memPercent = Number(((memory_stats.usage / memory_stats.limit) * 100).toFixed(2));

  return {
    cpuPercent,
    memUsageMB,
    memLimitMB,
    memPercent,
  };
}