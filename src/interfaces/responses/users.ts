export interface IUser {
    username: string
    uid: string,
    type: string
}

type CreateUserSuccess = {
    status: true
    message: string
    user: IUser
}
type CreateUserFailed = {
    status: false,
    message: string,
    error: unknown
}
export type CreateUserResponse = CreateUserSuccess | CreateUserFailed

type DeleteUserSuccess = {
    status: true
    message: string,
}
type DeleteUserFailed = {
    status: false,
    message: string,
    error: unknown
}
export type DeleteUserResponse = DeleteUserSuccess | DeleteUserFailed

type UpdateUserSuccess = {
    status: true
    message: string,
    user: IUser
}
type UpdateUserFailed = {
    status: false,
    message: string,
    error: unknown
}
export type UpdateUserResponse = UpdateUserSuccess | UpdateUserFailed

type GetUserSuccess = {
    status: true
    message: string,
    users: IUser[]
}
type GetUserFailed = {
    status: false,
    message: string,
    error: unknown
}
export type GetUserResponse = GetUserSuccess | GetUserFailed