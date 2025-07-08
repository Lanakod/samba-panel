import { WebSocket } from "ws";
import { PassThrough } from "stream";
import { dockerClient } from "@/utils";
import { env } from "@/env";

const clients = new Set<WebSocket>();
let logStream: PassThrough | null = null;

// --- HTTP fallback for unsupported upgrade ---
export function GET() {
  const headers = new Headers();
  headers.set("Connection", "Upgrade");
  headers.set("Upgrade", "websocket");
  return new Response("Upgrade Required", { status: 426, headers });
}

// --- WebSocket handler ---
export async function SOCKET(client: WebSocket) {
  clients.add(client);
  console.log(`[WS] Log client connected (${clients.size})`);

  if (clients.size === 1) {
    console.log("[WS] Starting Docker log stream");
    await startLogStream();
  }

  client.on("close", () => {
    clients.delete(client);
    console.log(`[WS] Log client disconnected (${clients.size})`);

    if (clients.size === 0 && logStream) {
      logStream.destroy();
      logStream = null;
      console.log("[WS] No clients remaining. Log stream closed.");
    }
  });
}

// --- Stream Docker logs and broadcast to clients ---
async function startLogStream() {
  const container = dockerClient.getContainer(env.CONTAINER_NAME);

  try {
    const stream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
      tail: 100,
    });

    logStream = new PassThrough();
    stream.pipe(logStream);

    logStream.on("data", (chunk: Buffer) => {
      const logLine = chunk.toString("utf-8");

      clients.forEach((c) => {
          if (c.readyState === WebSocket.OPEN) c.send(JSON.stringify({
            type: "log",
            data: logLine,
            time: new Date().toLocaleTimeString()
        }));
      });
    });

    logStream.on("error", (err) => {
      console.error("[LogStream Error]", err);
    });

    logStream.on("end", () => {
      console.log("[LogStream] Ended");
    });
  } catch (err) {
    console.error("[/api/server/logs - ERROR]", err);
  }
}
