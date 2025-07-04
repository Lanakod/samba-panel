import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/env';
import { dockerClient } from '@/utils';


type Params = {
    action: string
}

type Data = {
    params: Promise<Params>
}

export async function POST(request: NextRequest,  { params }: Data ) {
    try {
        const { action } = await params
        const container = dockerClient.getContainer(env.CONTAINER_NAME)
        switch (action) {
            case "stop": {
                await container.stop()
                return NextResponse.json({stopped: true})
            }
            case "restart": {
                await container.restart()
                return NextResponse.json({restarted: true})
            }
            case "start": {
                await container.start()
                return NextResponse.json({started: true})
            }
        }
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 })
    }
}