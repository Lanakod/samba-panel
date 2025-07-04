import { CreateUserResponse } from "@/interfaces"
import { IUser } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"

export const CreateUser = async (
    username: string,
    password: string,
    setUsers: Dispatch<SetStateAction<IUser[]>>
) => {
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
        return
    }
    console.error(data.error)
}