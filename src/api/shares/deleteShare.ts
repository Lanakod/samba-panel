import { DeleteShareResponse, IShare } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"
import {notification} from "@/utils";

export const DeleteShare = async (
    name: string,
    setShares: Dispatch<SetStateAction<IShare[]>>
) => {
    try {
        const res = await fetch('/api/shares', {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({name})
        })
        const data = await res.json() as DeleteShareResponse
        if(data.status) {
            setShares(shares => shares.filter(s => s.name !== name))
            notification.success("Share removed", data.message)
            return
        }
        notification.error("Error", data.message)
        console.error(data.error)
    } catch (e) {
        notification.error("Error", "Internal Server Error")
        console.error(e)
    }
}