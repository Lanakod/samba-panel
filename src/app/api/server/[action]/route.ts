export const runtime = 'nodejs';

import {NextRequest, NextResponse} from 'next/server'
import {env} from '@/env';
import {dockerClient, handleApiError, requireAuth} from '@/lib';


type Params = {
    action: string
}

type Data = {
    params: Promise<Params>
}

export async function POST(request: NextRequest, {params}: Data) {
    try {
        await requireAuth()
        const {action} = await params
        const container = dockerClient.getContainer(env.CONTAINER_NAME)
        switch (action) {
            case "stop": {
                await container.stop()
                return NextResponse.json({status: true, message: "Stopping server"})
            }
            case "restart": {
                await container.restart()
                return NextResponse.json({status: true, message: "Restarting server"})
            }
            case "start": {
                await container.start()
                return NextResponse.json({status: true, message: "Starting server"})
            }
        }
    } catch (e) {
        const {status, message, error} = handleApiError(e)
        return NextResponse.json({
            status: false,
            message,
            error
        }, {status})
    }
}