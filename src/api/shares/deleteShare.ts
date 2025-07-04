import { DeleteShareResponse, IShare } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"

export const DeleteShare = async (
    name: string,
    setShares: Dispatch<SetStateAction<IShare[]>>
) => {
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
        return
    }
    console.error(data.error)
}