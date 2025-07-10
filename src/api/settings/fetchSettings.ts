import {GetSettingsResponse} from "@/interfaces"
import {Dispatch, SetStateAction} from "react"

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
            return data.settings
        } else {
            setIsFetching(false)
            setError(data.message);
            return null
        }
    } catch (e) {
        console.error(e);
        setError('Failed to load settings');
        setIsFetching(false);
    }
}