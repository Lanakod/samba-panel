import {UpdateSettingsResponse} from "@/interfaces"
import {Dispatch, SetStateAction} from "react"

type UpdateOk = {
    status: true,
    message: string,
    setting: Record<string, string>
}

type UpdateError = {
    status: false,
    message: string
}

export const UpdateSettings = async (
    settings: Record<string, string>,
    setIsFetching: Dispatch<SetStateAction<boolean>>
): Promise<UpdateOk | UpdateError> => {
    try {
        setIsFetching(true)
        const res = await fetch('/api/server/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                settings
            }),
        })
        const data: UpdateSettingsResponse = await res.json()
        if (data.status) {
            setIsFetching(false)
            return data
        } else {
            setIsFetching(false)
            return {
                status: false,
                message: data.message
            }
        }
    } catch (e) {
        console.error(e);
        setIsFetching(false);
        return {
            status: false,
            message: 'Failed to load settings'
        }
    }
}