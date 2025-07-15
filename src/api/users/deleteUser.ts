import { DeleteUserResponse, IUser } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"
import {notification} from "@/utils";

export const DeleteUser = async (
    username: string,
    setUsers: Dispatch<SetStateAction<IUser[]>>
) => {
    try {
        const res = await fetch('/api/users', {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({username})
        })
        const data = await res.json() as DeleteUserResponse
        if (data.status) {
            setUsers(users => users.filter(u => u.username !== username))
            notification.success("User removed", data.message)
            return
        }
        notification.error("Error", data.message)
        console.error(data.error)
    } catch (e) {
        notification.error("Error", "Internal Server Error")
        console.error(e)
    }
}