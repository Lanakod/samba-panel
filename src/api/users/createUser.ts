import { CreateUserResponse } from "@/interfaces"
import { IUser } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"
import {notification} from "@/utils";

export const CreateUser = async (
    username: string,
    password: string,
    setUsers: Dispatch<SetStateAction<IUser[]>>
) => {
    try {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username, password
            })
        })
        const data = await res.json() as CreateUserResponse
        if(data.status) {
            setUsers(users => [...users, data.user])
            notification.success("User created", data.message)
            return
        }
        notification.error("Error", data.message)
        console.error(data.error)
    } catch (e) {
        notification.error("Error", "Internal Server Error")
        console.error(e)
    }
}