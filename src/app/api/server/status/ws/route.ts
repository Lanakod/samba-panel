import { env } from "@/env";
import { ContainerStatus } from "@/interfaces";
import { dockerClient, parseDockerStats } from "@/utils";
import { WebSocket } from "ws";
// import { IncomingMessage } from "http";
// import { WebSocketServer, WebSocket } from "ws";

export function GET() {
  const headers = new Headers();
  headers.set("Connection", "Upgrade");
  headers.set("Upgrade", "websocket");
  return new Response("Upgrade Required", { status: 426, headers });
}

// Module-level variables
const clients = new Set<WebSocket>();
let intervalId: NodeJS.Timeout | null = null;


// Helper function to fetch container status
async function getContainerStatus() {
  try {
    const container = dockerClient.getContainer(env.CONTAINER_NAME);
    const inspect = await container.inspect();
    let stats = undefined;
    let state: ContainerStatus = 'stopped'
    if (inspect.State.Running) {
      const rawStats = await container.stats({ stream: false });
      stats = parseDockerStats(rawStats);
      state = 'running'
    }
    if(inspect.State.Restarting)
        state = 'restarting'

    return { state, ...stats, time: new Date().toLocaleTimeString() };
  } catch (e) {
    console.error("Error fetching container status:", e);
    return { state: 'stopped' };
  }
}

export async function SOCKET(
  client: WebSocket,
  // request: IncomingMessage,
  // server: WebSocketServer
) {
  // Increment client count
  clients.add(client)
  console.log(`[WS] A client connected. Total: ${clients.size}`);

  // Start interval if this is the first client
  if (clients.size === 1 && !intervalId) {
    console.log("[WS] A first client connected. Starting interval.")
    intervalId = setInterval(async () => {
      try {
        const status = await getContainerStatus();
        const message = JSON.stringify(status);

        clients.forEach((c) => {
          if (c.readyState === WebSocket.OPEN) {
            c.send(message);
          }
        });
      } catch (e) {
        console.error("Error in interval:", e);
      }
    }, 1000);
  }

  // Send initial data to the client
  try {
    const status = await getContainerStatus();
    client.send(JSON.stringify(status));
  } catch (e) {
    console.error("Error sending initial data:", e);
  }

  // Set up close handler
  client.on("close", () => {
    clients.delete(client);
    console.log(`[WS] A client disconnected. Total: ${clients.size}`);

    // Stop the interval if no clients remain
    if (clients.size === 0 && intervalId) {
        console.log("[WS] All clients are disconnected, clearing interval")
      clearInterval(intervalId);
      intervalId = null;
    }
  });
}