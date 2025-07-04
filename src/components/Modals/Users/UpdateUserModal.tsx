'use client'
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Button, Group, Modal, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { UpdateUserSchema } from "@/schemas";
import { IUser, UpdateUserForm } from "@/interfaces";
import { UpdateUser } from "@/api";


type Props = {
    opened: boolean
    open: () => void
    close: () => void
    setUsers: Dispatch<SetStateAction<IUser[]>>,
    values: UpdateUserForm | null
}

export const UpdateUserModal: FC<Props> = ({opened, close, setUsers, values}) => {
    const updateForm = useForm<UpdateUserForm>({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            password: ''
        },

        validate: zodResolver(UpdateUserSchema)
    });

    useEffect(() => {
        if(values) updateForm.setValues(values)
    }, [values])

    return (
        <Modal opened={opened} onClose={close} title="Edit user" centered>
            <form onSubmit={updateForm.onSubmit( async ({username, password}) => {
                    await UpdateUser(username, password, setUsers)
                    close()
                })}>
                <PasswordInput
                    label="Password"
                    placeholder="Str0ngP@ssw0rd"
                    key={updateForm.key('password')}
                    {...updateForm.getInputProps('password')}
                />
                <Group mt="xl">
                    <Button color='red' onClick={close}>Cancel</Button>
                    <Button type="submit" color='green'>Create</Button>
                </Group>
            </form>
        </Modal>
    )
}