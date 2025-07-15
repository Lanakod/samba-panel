import { IUser, UpdateUserResponse } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"
import {notification} from "@/utils";

export const UpdateUser = async (
    username: string,
    password: string,
    setUsers: Dispatch<SetStateAction<IUser[]>>
) => {
    try {
        const res = await fetch('/api/users', {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username, password
            })
        })
        const data = await res.json() as UpdateUserResponse
        if (data.status) {
            setUsers(users => users.map(u =>
                u.username === data.user.username ?
                    data.user : u
            ))
            notification.success("User updated", data.message)
            return
        }
        notification.error("Error", data.message)
        console.error(data.error)
    } catch (e) {
        notification.error("Error", "Internal Server Error")
        console.error(e)
    }
}