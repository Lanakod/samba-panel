'use client'

import { FC, useEffect, useMemo, useState } from "react";
import { Button, Card, Group, Popover, Text, Table, ActionIcon, Stack, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { DeleteShare, FetchShares } from "@/api/shares";
import { IShare, UpdateShareForm } from "@/interfaces";
import { CreateShareModal, UpdateShareModal } from "./Modals";

const {Tr, Td, Th, Thead, Tbody, ScrollContainer} = Table
const {Group: ActionIconGroup} = ActionIcon
const {Target, Dropdown} = Popover

const {Section: CardSection} = Card

export const SharesList: FC = () => {
    const [shares, setShares] = useState<IShare[]>([])
    const [isFetching, setIsFetching] = useState<boolean>(true)
    useEffect(() => {
        FetchShares(setShares, setIsFetching)
    }, [])


    const [createOpened, { open: createOpen, close: createClose }] = useDisclosure(false);
    const [updateOpened, { open: updateOpen, close: updateClose }] = useDisclosure(false);

    const [updateValues, setUpdateValues] = useState<UpdateShareForm | null>(null)

    const rows = useMemo(() => {
        return shares.map((s, i) => <Tr key={i}>
            <Td>{s.name}</Td>
            <Td>{s.readOnly ? 'Yes' : 'No'}</Td>
            <Td>{s.path}</Td>
            <Td>{s.comment}</Td>
            <Td>
                <ActionIconGroup>
                    <ActionIcon onClick={() => {
                        setUpdateValues({
                            originalName: s.name,
                            ...s
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
                                <Text>Delete this share?</Text>
                                <Button onClick={() => DeleteShare(s.name, setShares)} color="red">Yes</Button>
                            </Stack>
                        </Dropdown>
                    </Popover>
                </ActionIconGroup>
            </Td>
        </Tr>)
    }, [shares])

    return (
        <>
        <CreateShareModal close={createClose} open={createOpen} opened={createOpened} setShares={setShares}/>
        <UpdateShareModal close={updateClose} open={updateOpen} opened={updateOpened} setShares={setShares} values={updateValues}/>

        <Card withBorder shadow="sm" radius="md" pos='relative'>
            <CardSection withBorder inheritPadding py="xs">
                <Group align="center" gap='xs'>
                    <Text fw={500}>Shares</Text>
                    <ActionIconGroup>
                        <ActionIcon variant="light" aria-label="Refresh Shares" onClick={() => FetchShares(setShares, setIsFetching)}>
                            <IconRefresh style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>

                        <ActionIcon variant="light" aria-label="Add Share" onClick={createOpen}>
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
                            <Th>Name</Th>
                            <Th>Read-Only</Th>
                            <Th>Path</Th>
                            <Th>Comment</Th>
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