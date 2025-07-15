import { GetUserResponse, IUser } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"
import {notification} from "@/utils";

export const FetchUsers = async (
    setUsers: Dispatch<SetStateAction<IUser[]>>,
    setIsFetching: Dispatch<SetStateAction<boolean>>
) => {
    try {
        setIsFetching(true)
        const res = await fetch('/api/users', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json() as GetUserResponse
        if (data.status) {
            setUsers(data.users)
            setIsFetching(false)
            notification.success("Users fetched", data.message)
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