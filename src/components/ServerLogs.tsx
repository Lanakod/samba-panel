'use client'

import {FC, useEffect, useMemo, useState} from "react";
import {Card, Table, Text} from "@mantine/core";
import {GetServerLogsResponse} from "@/interfaces";
import {useWebSocket} from "@/hooks";

const {Tr, Td, Th, Thead, Tbody, ScrollContainer} = Table
const {Section: CardSection} = Card

export const ServerLogs: FC = () => {
    const [logs, setLogs] = useState<GetServerLogsResponse[]>([])

    const panelUrl = useMemo(() => {
        if (typeof window !== 'undefined' && window.__ENV__) {
            return window.__ENV__.NEXT_PUBLIC_PANEL_URL as string;
        }
        return 'http://localhost:3000'; // fallback
    }, []);

    const socket = useWebSocket(() => panelUrl + '/api/server/logs')


    useEffect(() => {
        const controller = new AbortController();

        socket?.addEventListener('message', async (event) => {
                const payload =
                    typeof event.data === 'string' ? event.data : await event.data.text();
                const message = JSON.parse(payload) as GetServerLogsResponse;
                setLogs(log => [...log, message]);
            },
            controller,
        );

        socket?.addEventListener('error', () => {
        }, controller);
        socket?.addEventListener('close', () => {
        }, controller);

        return () => controller.abort();
    }, [socket]);

    const rows = useMemo(() => {
        return logs.map(log => <Tr key={log.data}>
            <Td>{log.time}</Td>
            <Td>{log.data}</Td>
        </Tr>)
    }, [logs])

    return (
        <Card withBorder shadow="sm" radius="md">
            <CardSection withBorder inheritPadding py="xs">
                <Text fw={500}>Server Logs</Text>
            </CardSection>
            <ScrollContainer minWidth={500} maxHeight={300}>
                <Table stickyHeader>
                    <Thead>
                        <Tr>
                            <Th>Time</Th>
                            <Th>Message</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{rows}</Tbody>
                </Table>
            </ScrollContainer>
        </Card>
    )
}