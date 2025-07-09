type SendCommandSuccess = {
    status: true
    message: string
}
type SendCommandFailed = {
    status: false,
    message: string,
    error: unknown
}
export type SendCommandResponse = SendCommandSuccess | SendCommandFailed
