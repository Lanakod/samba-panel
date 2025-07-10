'use client'
import {Dispatch, FC, SetStateAction, useEffect} from "react";
import {Button, Checkbox, Group, Modal, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {zodResolver} from "mantine-form-zod-resolver";
import {UpdateShareSchema} from "@/schemas";
import {UpdateShare} from "@/api/shares";
import {IShare, UpdateShareForm} from "@/interfaces";

type Props = {
    opened: boolean
    open: () => void
    close: () => void
    setShares: Dispatch<SetStateAction<IShare[]>>,
    values: UpdateShareForm | null
}

export const UpdateShareModal: FC<Props> = ({opened, close, setShares, values}) => {
    const updateForm = useForm<UpdateShareForm>({
        mode: 'uncontrolled',
        initialValues: {
            originalName: '',
            name: '',
            path: '',
            comment: '',
            readOnly: false,
        },

        validate: zodResolver(UpdateShareSchema)
    });

    useEffect(() => {
        if (values) updateForm.setValues(values)
    }, [values])

    return (
        <Modal opened={opened} onClose={close} title="Edit share" centered>
            <form onSubmit={updateForm.onSubmit(async ({originalName, name, comment, path, readOnly}) => {
                await UpdateShare(originalName, name, path, comment, readOnly, setShares)
                close()
            })}>
                <TextInput
                    withAsterisk
                    label="Name of share"
                    placeholder="My Share"
                    key={updateForm.key('name')}
                    {...updateForm.getInputProps('name')}
                />
                <TextInput
                    withAsterisk
                    label="Path"
                    placeholder="/mnt/my-share"
                    key={updateForm.key('path')}
                    {...updateForm.getInputProps('path')}
                />
                <TextInput
                    label="Comment"
                    placeholder="Bob's share"
                    key={updateForm.key('comment')}
                    {...updateForm.getInputProps('comment')}
                />
                <Checkbox
                    mt="md"
                    label="Read-Only Share"
                    key={updateForm.key('readOnly')}
                    {...updateForm.getInputProps('readOnly', {type: 'checkbox'})}
                />
                <Group mt="xl">
                    <Button color='red' onClick={close}>Cancel</Button>
                    <Button type="submit" color='green'>Create</Button>
                </Group>
            </form>
        </Modal>
    )
}