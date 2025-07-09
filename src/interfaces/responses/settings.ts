type CreateSettingSuccess = {
    status: true
    message: string
    setting: Record<string, string>
}
type CreateSettingFailed = {
    status: false,
    message: string,
    error: unknown
}
export type CreateSettingResponse = CreateSettingSuccess | CreateSettingFailed

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