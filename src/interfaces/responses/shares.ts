export interface IShare {
  name: string;
  path: string;
  comment: string;
  readOnly: boolean;
  createMask: string;
  directoryMask: string;
  browsable: boolean;
  guestOk: boolean;
}

type CreateShareSuccess = {
    status: true
    message: string
    share: IShare
}
type CreateShareFailed = {
    status: false,
    message: string,
    error: unknown
}
export type CreateShareResponse = CreateShareSuccess | CreateShareFailed

type DeleteShareSuccess = {
    status: true
    message: string,
}
type DeleteShareFailed = {
    status: false,
    message: string,
    error: unknown
}
export type DeleteShareResponse = DeleteShareSuccess | DeleteShareFailed

type UpdateShareSuccess = {
    status: true
    message: string,
    share: IShare
}
type UpdateShareFailed = {
    status: false,
    message: string,
    error: unknown
}
export type UpdateShareResponse = UpdateShareSuccess | UpdateShareFailed

type GetShareSuccess = {
    status: true
    message: string,
    shares: IShare[]
}
type GetShareFailed = {
    status: false,
    message: string,
    error: unknown
}
export type GetShareResponse = GetShareSuccess | GetShareFailed