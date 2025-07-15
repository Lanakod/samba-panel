import {NextRequest, NextResponse} from 'next/server';
import {env} from '@/env';
import {
    getGlobalSection,
    handleApiError,
    parseFile,
    parseGlobalSection,
    requireAuth,
    saveToFile,
    updateSection
} from '@/lib';

export async function GET() {
    try {
        await requireAuth()
        const sections = parseFile(env.SMB_CONF_PATH);
        const global = getGlobalSection(sections);
        if (!global) {
            return NextResponse.json({
                status: false,
                message: 'Global section not found',
                error: 'Global section not found'
            }, {status: 404});
        }

        const parsed = parseGlobalSection(global);
        return NextResponse.json({status: true, message: "Fetched", settings: parsed});
    } catch (e) {
        const {status, message, error} = handleApiError(e)
        return NextResponse.json({
            status: false,
            message,
            error
        }, {status})
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const newSettings = body.settings as Record<string, string>;

        const sections = parseFile(env.SMB_CONF_PATH);
        const updated = updateSection(sections, 'global', newSettings);
        saveToFile(updated, env.SMB_CONF_PATH);

        return NextResponse.json({status: true, message: "Updated settings", setting: newSettings});
    } catch (e) {
        const {status, message, error} = handleApiError(e)
        return NextResponse.json({
            status: false,
            message,
            error
        }, {status})
    }
}
