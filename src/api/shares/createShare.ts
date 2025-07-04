import { CreateShareResponse, IShare } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"

export const CreateShare = async (
    name: string,
    path: string,
    comment: string,
    readOnly: boolean,
    setShares: Dispatch<SetStateAction<IShare[]>>
) => {
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
        return
    }
    console.error(data.error)
}