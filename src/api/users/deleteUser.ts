import { DeleteUserResponse, IUser } from "@/interfaces"
import { Dispatch, SetStateAction } from "react"

export const DeleteUser = async (
    username: string,
    setUsers: Dispatch<SetStateAction<IUser[]>>
) => {
    const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({username})
    })
    const data = await res.json() as DeleteUserResponse
    if(data.status) {
        setUsers(users => users.filter(u => u.username !== username))
        return
    }
    console.error(data.error)
}