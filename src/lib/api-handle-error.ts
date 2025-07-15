import {AuthError} from "@/interfaces";
import {z, ZodIssue} from "zod";

type AuthErrorResponse = {
    status: 401,
    message: string
    error: unknown
}

type ZodErrorResponse = {
    status: 400,
    message: string,
    error: ZodIssue[]
}

type InternalErrorResponse = {
    status: 500,
    message: string,
    error: unknown
}

type HandleApiErrorResponse = AuthErrorResponse | ZodErrorResponse | InternalErrorResponse

export const handleApiError = (e: unknown): HandleApiErrorResponse => {
    if(e instanceof AuthError) {
        return {
            status: 401,
            message: e.message,
            error: e.message,
        }
    }
    if (e instanceof z.ZodError) {
        return {
            status: 400,
            message: "Bad Request",
            error: e.errors
        }
    }
    return {
        status: 500,
        message: "Internal Server Error",
        error: e
    }
}