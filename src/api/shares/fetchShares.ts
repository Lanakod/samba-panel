import { GetShareResponse, IShare } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"
import {notification} from "@/utils";

export const FetchShares = async (
    setShares: Dispatch<SetStateAction<IShare[]>>,
    setIsFetching: Dispatch<SetStateAction<boolean>>
) => {
    try {
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
            notification.success("Shares fetched", data.message)
            return
        }
        setIsFetching(false)
        notification.error("Error", data.message)
        console.error(data.error)
    } catch (e) {
        notification.error("Error", "Internal Server Error")
        console.error(e)
    }
}