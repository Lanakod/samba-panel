'use client'
import { Dispatch, FC, SetStateAction } from "react";
import { Button, Checkbox, Group, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { CreateShareSchema } from "@/schemas";
import { CreateShare } from "@/api/shares";
import { CreateShareForm, IShare } from "@/interfaces";


type Props = {
    opened: boolean
    open: () => void
    close: () => void
    setShares: Dispatch<SetStateAction<IShare[]>>
}

export const CreateShareModal: FC<Props> = ({opened, close, setShares}) => {
    const createForm = useForm<CreateShareForm>({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            path: '',
            comment: '',
            readOnly: false,
        },

        validate: zodResolver(CreateShareSchema)
    });

    return (
        <Modal opened={opened} onClose={close} title="Create new share" centered>
            <form onSubmit={createForm.onSubmit(async ({name,comment,path,readOnly}) => {
                    await CreateShare(name,path, comment, readOnly, setShares)
                    close()
                    createForm.setValues({
                        name: '',
                        path: '',
                        comment: '',
                        readOnly: false,
                    })
                })}>
                <TextInput
                    withAsterisk
                    label="Name of share"
                    placeholder="My Share"
                    key={createForm.key('name')}
                    {...createForm.getInputProps('name')}
                />
                <TextInput
                    withAsterisk
                    label="Path"
                    placeholder="/mnt/my-share"
                    key={createForm.key('path')}
                    {...createForm.getInputProps('path')}
                />
                <TextInput
                    label="Comment"
                    placeholder="Bob's share"
                    key={createForm.key('comment')}
                    {...createForm.getInputProps('comment')}
                />
                <Checkbox
                    mt="md"
                    label="Read-Only Share"
                    key={createForm.key('readOnly')}
                    {...createForm.getInputProps('readOnly', { type: 'checkbox' })}
                />
                <Group mt="xl">
                    <Button color='red' onClick={close}>Cancel</Button>
                    <Button type="submit" color='green'>Create</Button>
                </Group>
            </form>
        </Modal>
    )
}