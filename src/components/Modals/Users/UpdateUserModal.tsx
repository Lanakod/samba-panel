'use client'
import {Dispatch, FC, SetStateAction, useEffect} from "react";
import {Button, Group, Modal, PasswordInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {zodResolver} from "mantine-form-zod-resolver";
import {UpdateUserSchema} from "@/schemas";
import {IUser, UpdateUserForm} from "@/interfaces";
import {UpdateUser} from "@/api";

type Props = {
    opened: boolean
    open: () => void
    closeAction: () => void
    setUsersAction: Dispatch<SetStateAction<IUser[]>>,
    values: UpdateUserForm | null
}

export const UpdateUserModal: FC<Props> = ({opened, closeAction, setUsersAction, values}) => {
    const updateForm = useForm<UpdateUserForm>({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            password: ''
        },

        validate: zodResolver(UpdateUserSchema)
    });

    useEffect(() => {
        if (values) updateForm.setValues(values)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values])

    return (
        <Modal opened={opened} onClose={closeAction} title="Edit user" centered>
            <form onSubmit={updateForm.onSubmit(async ({username, password}) => {
                await UpdateUser(username, password, setUsersAction)
                closeAction()
            })}>
                <PasswordInput
                    label="Password"
                    placeholder="Str0ngP@ssw0rd"
                    key={updateForm.key('password')}
                    {...updateForm.getInputProps('password')}
                />
                <Group mt="xl">
                    <Button color='red' onClick={closeAction}>Cancel</Button>
                    <Button type="submit" color='green'>Create</Button>
                </Group>
            </form>
        </Modal>
    )
}