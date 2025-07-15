import {notification} from "@/utils";
import {AuthResponse} from "@/interfaces";

export const Authenticate = async (
    username: string,
    password: string
) => {
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username, password
            })
        })
        const data = await res.json() as AuthResponse
        if(data.status) {
            notification.success("Authorized", data.message)
            return true
        }
        notification.error("Error", data.message)
        return false
    } catch (e) {
        notification.error("Error", "Internal Server Error")
        console.error(e)
        return false
    }
}
export const Logout = async () => {
    try {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        })
        const data = await res.json() as AuthResponse
        if(data.status) {
            notification.success("Logged Out", data.message)
            return true
        }
        notification.error("Error", data.message)
        return false
    } catch (e) {
        notification.error("Error", "Internal Server Error")
        console.error(e)
        return false
    }
}