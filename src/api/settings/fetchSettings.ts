import {GetSettingsResponse} from "@/interfaces"
import {Dispatch, SetStateAction} from "react"
import {notification} from "@/utils";

export const FetchSettings = async (
    setError: Dispatch<SetStateAction<string | null>>,
    setIsFetching: Dispatch<SetStateAction<boolean>>
) => {
    try {
        setIsFetching(true)
        const res = await fetch('/api/server/settings')
        const data: GetSettingsResponse = await res.json()
        if (data.status) {
            setIsFetching(false)
            notification.success("Settings fetched", data.message)
            return data.settings
        } else {
            setIsFetching(false)
            setError(data.message);
            notification.error("Error", data.message)
            return null
        }
    } catch (e) {
        console.error(e);
        notification.error("Error", "Internal Server Error")
        setError('Failed to load settings');
        setIsFetching(false);
    }
}