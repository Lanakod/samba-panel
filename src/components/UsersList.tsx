'use client'

import { DeleteUser, FetchUsers } from "@/api";
import { IUser, UpdateUserForm } from "@/interfaces";
import { FC, useEffect, useMemo, useState } from "react";
import { Button, Card, Group, Popover, Text, Table, ActionIcon, Stack, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { CreateUserModal, UpdateUserModal } from "./Modals";

const {Tr, Td, Th, Thead, Tbody, ScrollContainer} = Table
const {Group: ActionIconGroup} = ActionIcon
const {Target, Dropdown} = Popover


const {Section: CardSection} = Card

export const UserList: FC = () => {
    const [users, setUsers] = useState<IUser[]>([])
    const [isFetching, setIsFetching] = useState<boolean>(true)
    useEffect(() => {
        FetchUsers(setUsers, setIsFetching)
    }, [])

    const [createOpened, { open: createOpen, close: createClose }] = useDisclosure(false);
    const [updateOpened, { open: updateOpen, close: updateClose }] = useDisclosure(false);

    const [updateValues, setUpdateValues] = useState<UpdateUserForm | null>(null)


    const rows = useMemo(() => {
        return users.map((u, i) => <Tr key={i}>
            <Td>{u.username}</Td>
            <Td>{u.uid}</Td>
            <Td>{u.type}</Td>
            <Td>
                <ActionIconGroup>
                    <ActionIcon onClick={() => {
                        setUpdateValues({
                            username: u.username,
                            password: ''
                        })
                        updateOpen()
                    }} variant="light" color="yellow" aria-label="Edit">
                        <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                    <Popover>
                        <Target>
                            <ActionIcon variant="light" color="red" aria-label="Delete">
                                <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                            </ActionIcon>
                        </Target>
                        <Dropdown>
                            <Stack>
                                <Text>Delete this user?</Text>
                                <Button
                                onClick={() => DeleteUser(u.username, setUsers)}
                                color="red">Yes</Button>
                            </Stack>
                        </Dropdown>
                    </Popover>
                </ActionIconGroup>
            </Td>
        </Tr>)
    }, [users])

    return (
        <>
        <CreateUserModal close={createClose} open={createOpen} opened={createOpened} setUsers={setUsers}/>
        <UpdateUserModal close={updateClose} open={updateOpen} opened={updateOpened} setUsers={setUsers} values={updateValues}/>

        <Card withBorder shadow="sm" radius="md" pos='relative'>
            <CardSection withBorder inheritPadding py="xs">
                <Group align="center" gap='xs'>
                    <Text fw={500}>Users</Text>
                    <ActionIconGroup>
                        <ActionIcon variant="light" aria-label="Refresh Users" onClick={() => FetchUsers(setUsers, setIsFetching)}>
                            <IconRefresh style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>

                        <ActionIcon variant="light" aria-label="Add User" onClick={createOpen}>
                            <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </ActionIconGroup>
                </Group>
            </CardSection>
            <ScrollContainer minWidth={500} maxHeight={600}>
                <LoadingOverlay visible={isFetching} zIndex={5} overlayProps={{ radius: "sm", blur: 2 }}/>
                <Table stickyHeader>
                    <Thead>
                        <Tr>
                            <Th>Username</Th>
                            <Th>UID</Th>
                            <Th>Type</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{rows}</Tbody>
                </Table>
            </ScrollContainer>
        </Card>
        </>
    )
}