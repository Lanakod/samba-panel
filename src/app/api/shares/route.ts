import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {
    createSection,
    getSection, handleApiError,
    parseFile,
    parseSection,
    parseSmbConf,
    removeSection,
    renameSection, requireAuth,
    saveToFile,
    updateSection
} from "@/lib"
import {env} from "@/env"
import {CreateShareSchema, DeleteShareSchema, UpdateShareSchema} from "@/schemas"

export async function POST(request: NextRequest) {
    try {
        await requireAuth()
        const body = await request.json()
        const {name, path: sharePath, readOnly, comment} = CreateShareSchema.parse(body)

        let sections = parseFile(env.SMB_CONF_PATH)

        sections = createSection(sections, name, {
            path: sharePath,
            comment: `${comment}`,
            'read only': readOnly ? "yes" : "no",
            'create mask': '0777',
            'directory mask': '0777',
            browsable: 'yes',
            'guest ok': 'no'
        })
        saveToFile(sections, env.SMB_CONF_PATH)
        const createdShare = getSection(sections, name)
        if (!createdShare)
            return NextResponse.json({
                status: false,
                message: "Section Not Found in smb.conf",
                error: "Section Not Found in smb.conf"
            })
        return NextResponse.json({status: true, share: parseSection(createdShare)}, {status: 201})
    } catch (e) {
        const {status, message, error} = handleApiError(e)
        return NextResponse.json({
            status: false,
            message,
            error
        }, {status})
    }
}

export async function PUT(request: NextRequest) {
    try {
        await requireAuth()
        const body = await request.json()
        const {originalName, name, path: sharePath, readOnly, comment} = UpdateShareSchema.parse(body)

        let sections = parseFile(env.SMB_CONF_PATH)

        sections = updateSection(sections, originalName, {
            path: sharePath,
            comment: `${comment}`,
            'read only': readOnly ? "yes" : "no",
            'create mask': '0777',
            'directory mask': '0777',
            browsable: 'yes',
            'guest ok': 'no'
        })

        if (originalName !== name) {
            sections = renameSection(sections, originalName, name)
        }

        saveToFile(sections, env.SMB_CONF_PATH)
        const updatedShare = getSection(sections,
            originalName !== name ? name : originalName
        )
        if (!updatedShare)
            return NextResponse.json({
                status: false,
                message: "Section Not Found in smb.conf",
                error: "Section Not Found in smb.conf"
            })
        return NextResponse.json({status: true, share: parseSection(updatedShare)}, {status: 200})
    } catch (e) {
        const {status, message, error} = handleApiError(e)
        return NextResponse.json({
            status: false,
            message,
            error
        }, {status})
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await requireAuth()
        const body = await request.json()
        const {name} = DeleteShareSchema.parse(body)

        let sections = parseFile(env.SMB_CONF_PATH)

        sections = removeSection(sections, name)
        saveToFile(sections, env.SMB_CONF_PATH)
        return NextResponse.json({status: true, message: "Share was deleted"}, {status: 200})
    } catch (e) {
        const {status, message, error} = handleApiError(e)
        return NextResponse.json({
            status: false,
            message,
            error
        }, {status})
    }
}

export async function GET() {
    try {
        await requireAuth()
        const shares = parseSmbConf(env.SMB_CONF_PATH)
        return NextResponse.json({
            status: true,
            shares
        })
    } catch (e) {
        const {status, message, error} = handleApiError(e)
        return NextResponse.json({
            status: false,
            message,
            error
        }, {status})
    }
}