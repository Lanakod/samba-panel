'use client'
import {Dispatch, FC, SetStateAction} from "react";
import {Button, Group, Modal, PasswordInput, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {zodResolver} from "mantine-form-zod-resolver";
import {CreateUserSchema} from "@/schemas";
import {CreateUserForm, IUser} from "@/interfaces";
import {CreateUser} from "@/api";

type Props = {
    opened: boolean
    open: () => void
    closeAction: () => void
    setUsersAction: Dispatch<SetStateAction<IUser[]>>
}

export const CreateUserModal: FC<Props> = ({opened, closeAction, setUsersAction}) => {
    const createForm = useForm<CreateUserForm>({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            password: ''

        },

        validate: zodResolver(CreateUserSchema)
    });

    return (
        <Modal opened={opened} onClose={closeAction} title="Add user" centered>
            <form onSubmit={createForm.onSubmit(async ({username, password}) => {
                await CreateUser(username, password, setUsersAction)
                closeAction()
            })}>
                <TextInput
                    withAsterisk
                    label="Username"
                    placeholder="Bob"
                    key={createForm.key('username')}
                    {...createForm.getInputProps('username')}
                />
                <PasswordInput
                    withAsterisk
                    label="Password"
                    placeholder="Str0ngP@ssw0rd"
                    key={createForm.key('password')}
                    {...createForm.getInputProps('password')}
                />
                <Group mt="xl">
                    <Button color='red' onClick={closeAction}>Cancel</Button>
                    <Button type="submit" color='green'>Create</Button>
                </Group>
            </form>
        </Modal>
    )
}