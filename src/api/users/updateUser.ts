import { IUser, UpdateUserResponse } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"

export const UpdateUser = async (
    username: string,
    password: string,
    setUsers: Dispatch<SetStateAction<IUser[]>>
) => {
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
    if(data.status) {
        setUsers(users => users.map(u =>
            u.username === data.user.username ?
            data.user : u
        ))
        return
    }
}