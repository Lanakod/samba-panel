import { IShare, UpdateShareResponse } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"
import {notification} from "@/utils";

export const UpdateShare = async (
    originalName: string,
    name: string,
    path: string,
    comment: string,
    readOnly: boolean,
    setShares: Dispatch<SetStateAction<IShare[]>>
) => {
    try {
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
        if (data.status) {
            setShares(shares => shares.map(s =>
                s.name === originalName ?
                    data.share : s
            ))
            notification.success("Share updated", data.message)
            return
        }
        notification.error("Error", data.message)
        console.error(data.error)
    } catch (e) {
        notification.error("Error", "Internal Server Error")
        console.error(e)
    }
}