type AuthSuccess = {
    status: true
    message: string
}
type AuthFailed = {
    status: false,
    message: string,
    error: unknown
}
export type AuthResponse = AuthSuccess | AuthFailed
