type UpdateSettingSuccess = {
    status: true
    message: string
    setting: Record<string, string>
}
type UpdateSettingFailed = {
    status: false,
    message: string,
    error: unknown
}
export type UpdateSettingsResponse = UpdateSettingSuccess | UpdateSettingFailed

type GetSettingsSuccess = {
    status: true
    message: string,
    settings: Record<string, string>
}
type GetSettingsFailed = {
    status: false,
    message: string,
    error: unknown
}
export type GetSettingsResponse = GetSettingsSuccess | GetSettingsFailed