import { IShare, UpdateShareResponse } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"

export const UpdateShare = async (
    originalName: string,
    name: string,
    path: string,
    comment: string,
    readOnly: boolean,
    setShares: Dispatch<SetStateAction<IShare[]>>
) => {
    const res = await fetch('/api/shares', {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            originalName,
            name,
            path,
            comment,
            readOnly
        })
    })
    const data = await res.json() as UpdateShareResponse
    if(data.status) {
        setShares(shares => shares.map(s =>
            s.name === originalName ?
            data.share : s
        ))
        return
    }
    console.error(data.error)
}