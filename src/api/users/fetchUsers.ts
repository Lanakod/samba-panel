import { GetUserResponse, IUser } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"

export const FetchUsers = async (
    setUsers: Dispatch<SetStateAction<IUser[]>>,
    setIsFetching: Dispatch<SetStateAction<boolean>>
) => {
    setIsFetching(true)
    const res = await fetch('/api/users', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
    const data = await res.json() as GetUserResponse
    if(data.status) {
        setUsers(data.users)
        setIsFetching(false)
        return
    }
    setIsFetching(false)
    console.error(data.error)
}