export * from './responses'


export type UpdateShareForm = {
    originalName: string
    name: string
    path: string
    comment: string
    readOnly: boolean
}

export type CreateShareForm = {
    name: string
    path: string
    comment: string
    readOnly: boolean
}

export type UpdateUserForm = {
    username: string
    password: string,
}

export type CreateUserForm = {
    username: string
    password: string,
}