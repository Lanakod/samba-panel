import {NextRequest} from 'next/server';
import {env} from '@/env';
import {getGlobalSection, parseFile, parseGlobalSection, saveToFile, updateSection} from '@/utils';

export async function GET() {
    try {
        const sections = parseFile(env.SMB_CONF_PATH);
        const global = getGlobalSection(sections);
        if (!global) {
            return Response.json({
                status: false,
                message: 'Global section not found',
                error: 'Global section not found'
            }, {status: 404});
        }

        const parsed = parseGlobalSection(global);
        return Response.json({status: true, message: "Fetched", settings: parsed});
    } catch (e) {
        console.error(e);
        return Response.json({
            status: false,
            message: 'Failed to load global section',
            error: 'Failed to load global section'
        }, {status: 500});
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const newSettings = body.settings as Record<string, string>;

        const sections = parseFile(env.SMB_CONF_PATH);
        const updated = updateSection(sections, 'global', newSettings);
        saveToFile(updated, env.SMB_CONF_PATH);

        return Response.json({status: true, message: "Updated settings", setting: newSettings});
    } catch (e) {
        console.error(e);
        return Response.json({
            status: false,
            message: "Failed to update global section",
            error: 'Failed to update global section'
        }, {status: 500});
    }
}
