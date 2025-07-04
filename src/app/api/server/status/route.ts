import { NextResponse } from 'next/server'
import { env } from '@/env';
import { dockerClient, parseDockerStats } from '@/utils';


export async function GET() {
    try {
        const container = dockerClient.getContainer(env.CONTAINER_NAME)
        const inspect = await container.inspect()
        const running = inspect.State.Running
        if(running) {
            const rawStats = await container.stats({stream: false})
            const stats = parseDockerStats(rawStats)
            return NextResponse.json({
                running,
                stats
            })
        }
        return NextResponse.json({
            running,
        })
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: "Container Not Running", error: e}, {
            status: 500
        })
    }
}

