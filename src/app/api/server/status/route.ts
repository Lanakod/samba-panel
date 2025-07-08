import { env } from "@/env";
import { ContainerStatus } from "@/interfaces";
import { dockerClient, parseDockerStats } from "@/utils";
import { WebSocket } from "ws";

const clients = new Set<WebSocket>();
let intervalId: NodeJS.Timeout | null = null;

export function GET() {
  const headers = new Headers();
  headers.set("Connection", "Upgrade");
  headers.set("Upgrade", "websocket");
  return new Response("Upgrade Required", { status: 426, headers });
}


// Helper: get current container status
async function getContainerStatus() {
  try {
    const container = dockerClient.getContainer(env.CONTAINER_NAME);
    const inspect = await container.inspect();
    let stats = undefined;
    let state: ContainerStatus = "stopped";

    if (inspect.State.Running) {
      const rawStats = await container.stats({ stream: false });
      stats = parseDockerStats(rawStats);
      state = "running";
    }
    if (inspect.State.Restarting) state = "restarting";

    return { type: "status", state, ...stats, time: new Date().toLocaleTimeString() };
  } catch (e) {
    console.error("[WS] Error fetching container status:", e);
    return { type: "status", state: "stopped" };
  }
}

export async function SOCKET(client: WebSocket) {
  clients.add(client);
  console.log(`[WS] Client connected. Total: ${clients.size}`);

  // Start periodic container status stream
  if (clients.size === 1 && !intervalId) {
    console.log("[WS] Starting status polling interval.");
    intervalId = setInterval(async () => {
      try {
        const status = await getContainerStatus();
        const message = JSON.stringify(status);
        clients.forEach((c) => {
          if (c.readyState === WebSocket.OPEN) c.send(message);
        });
      } catch (e) {
        console.error("[WS] Status interval error:", e);
      }
    }, 1000);
  }

  // Send initial status on connection
  try {
    const status = await getContainerStatus();
    client.send(JSON.stringify(status));
  } catch (e) {
    console.error("[/api/server/status - ERROR]:", e);
  }

  // Cleanup on disconnect
  client.on("close", () => {
    clients.delete(client);
    console.log(`[WS] Client disconnected. Total: ${clients.size}`);

    if (clients.size === 0) {
      console.log("[WS] No clients left. Cleaning up resources.");
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  });
}
