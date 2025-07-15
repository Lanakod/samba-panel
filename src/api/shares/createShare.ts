import { CreateShareResponse, IShare } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"
import {notification} from "@/utils";

export const CreateShare = async (
    name: string,
    path: string,
    comment: string,
    readOnly: boolean,
    setShares: Dispatch<SetStateAction<IShare[]>>
) => {
    try {
        const res = await fetch('/api/shares', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name,
                path,
                comment,
                readOnly
            })
        })
        const data = await res.json() as CreateShareResponse
        if(data.status) {
            setShares((shares) => [...shares, data.share])
            notification.success("Share created", data.message)
            return
        }
        notification.error("Error", data.message)
        console.error(data.error)
    } catch (e) {
        notification.error("Error", "Internal Server Error")
        console.error(e)
    }

}