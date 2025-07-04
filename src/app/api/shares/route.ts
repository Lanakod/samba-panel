import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSection, getSection, parseFile, parseSection, parseSmbConf, removeSection, renameSection, saveToFile, updateSection } from "@/utils"
import { env } from "@/env"
import { CreateShareSchema, DeleteShareSchema, UpdateShareSchema } from "@/schemas"
import { z } from "zod"

export async function POST(request: NextRequest) {
    try {
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
        if(!createdShare)
            return NextResponse.json({ status: false, message: "Section Not Found in smb.conf", error: "Section Not Found in smb.conf"})
        return NextResponse.json({ status: true, share: parseSection(createdShare)}, {status: 201})
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json({ status: false, message: "Bad Request", error: error.errors }, { status: 400 });
        }
        return Response.json({ status: false, message: "Internal Server Error", error }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
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

        if(originalName !== name) {
            sections = renameSection(sections, originalName, name)
        }

        saveToFile(sections, env.SMB_CONF_PATH)
        const updatedShare = getSection(sections,
            originalName !== name ? name : originalName
        )
        if(!updatedShare)
            return NextResponse.json({ status: false, message: "Section Not Found in smb.conf", error: "Section Not Found in smb.conf"})
        return NextResponse.json({ status: true, share: parseSection(updatedShare)}, {status: 200})
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json({ status: false, message: "Bad Request", error: error.errors }, { status: 400 });
        }
        return Response.json({ status: false, message: "Internal Server Error", error }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json()
        const {name} = DeleteShareSchema.parse(body)

        let sections = parseFile(env.SMB_CONF_PATH)
        
        sections = removeSection(sections, name)
        saveToFile(sections, env.SMB_CONF_PATH)
        return NextResponse.json({ status: true, message: "Share was deleted"}, {status: 200})
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json({ status: false, message: "Bad Request", error: error.errors }, { status: 400 });
        }
        return Response.json({ status: false, message: "Internal Server Error", error }, { status: 500 });
    }
}

export async function GET() {
    const shares = parseSmbConf(env.SMB_CONF_PATH)
    return NextResponse.json({
        status: true,
        shares
    })
}