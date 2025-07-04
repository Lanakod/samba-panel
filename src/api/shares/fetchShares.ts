import { GetShareResponse, IShare } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"

export const FetchShares = async (
    setShares: Dispatch<SetStateAction<IShare[]>>,
    setIsFetching: Dispatch<SetStateAction<boolean>>
) => {
    setIsFetching(true)
    const res = await fetch('/api/shares', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
    const data = await res.json() as GetShareResponse
    if(data.status) {
        setShares(data.shares)
        setIsFetching(false)
        return
    }
    setIsFetching(false)
    console.error(data.error)
}