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
                return NextResponse.json({success: true, message: "Stopping server"})
            }
            case "restart": {
                await container.restart()
                return NextResponse.json({success: true, message: "Restarting server"})
            }
            case "start": {
                await container.start()
                return NextResponse.json({success: true, message: "Starting server"})
            }
        }
    } catch (e) {
        return NextResponse.json({ success: false, message: "Error sending command to container", error: e }, { status: 500 })
    }
}