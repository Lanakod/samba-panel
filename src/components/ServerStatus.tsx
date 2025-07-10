'use client'

import {FC, useEffect, useMemo, useState} from "react";
import {Badge, Card, Divider, Group, LoadingOverlay, Stack, Text} from "@mantine/core";
import {GetServerStatusResponse} from "@/interfaces";
import {useWebSocket} from "@/hooks";
import {LineChart} from '@mantine/charts';

const {Section: CardSection} = Card

export const ServerStatus: FC = () => {
    const [statusArr, setStatusArr] = useState<GetServerStatusResponse[]>([])
    const status = useMemo<GetServerStatusResponse>(() => {
        const len = statusArr.length
        if (len)
            return statusArr[len - 1]
        return {
            type: 'status',
            state: 'fetching',
            time: new Date().toLocaleTimeString()
        }
    }, [statusArr])

    const panelUrl = useMemo(() => {
        if (typeof window !== 'undefined' && window.__ENV__) {
            return window.__ENV__.NEXT_PUBLIC_PANEL_URL as string;
        }
        return 'http://localhost:3000'; // fallback
    }, []);

    const socket = useWebSocket(() => panelUrl + '/api/server/status')


    const containerState = useMemo(() => {
        const {state: currentStatus} = status
        let color = "green"
        if (currentStatus === 'stopped') color = 'red'
        else if (currentStatus === 'restarting') color = 'yellow'
        else if (currentStatus === 'fetching') color = 'blue'
        return <Badge variant="light" color={color}>{currentStatus}</Badge>
    }, [status])

    const cpuUsage = useMemo(() => {
        if (status.state === 'running') return <Text>{status.cpuPercent}%</Text>
        return null
    }, [status])

    const memoryUsage = useMemo(() => {
        if (status.state === 'running') return <Text>
            {status.memUsageMB} MB / {status.memLimitMB} MB <Text c="dimmed"
                                                                  component="span">({status.memPercent}%)</Text>
        </Text>
        return null
    }, [status])

    useEffect(() => {
        const controller = new AbortController();

        socket?.addEventListener('message', async (event) => {
                const payload =
                    typeof event.data === 'string' ? event.data : await event.data.text();
                const message = JSON.parse(payload) as GetServerStatusResponse;
                setStatusArr(s => {
                    const newArr = [...s, message];
                    // Keep only last 60 messages
                    if (newArr.length > 60) {
                        return newArr.slice(newArr.length - 60);
                    }
                    return newArr;
                });
            },
            controller,
        );

        socket?.addEventListener('error', () => {
        }, controller);
        socket?.addEventListener('close', () => {
        }, controller);

        return () => controller.abort();
    }, [socket]);

    return (
        <Card withBorder shadow="sm" radius="md">
            <CardSection withBorder inheritPadding py="xs">
                <Text fw={500}>Server Status</Text>
            </CardSection>
            <Stack gap="xs" pos='relative' p='xs'>
                <LoadingOverlay visible={status.state === 'fetching'} zIndex={5}
                                overlayProps={{radius: "sm", blur: 2}}/>
                <Group justify="space-between" align="center">
                    <Text fw="600">Status:</Text>
                    {containerState}
                </Group>
                <Group justify="space-between" align="center">
                    <Text fw="600">CPU Usage:</Text>
                    {cpuUsage}
                </Group>
                <Group justify="space-between" align="center">
                    <Text fw="600">Memory:</Text>
                    {memoryUsage}
                </Group>
                <Divider my='md'/>
                <LineChart
                    h={300}
                    data={statusArr}
                    dataKey="time"
                    withLegend
                    legendProps={{verticalAlign: 'bottom', height: 50}}
                    xAxisLabel="Time"
                    xAxisProps={{padding: {left: 10, right: 10}}}
                    yAxisProps={{domain: [0, 100]}}
                    tooltipAnimationDuration={200}
                    unit="%"
                    series={[
                        {name: 'cpuPercent', label: 'CPU %', color: 'indigo.6'},
                        {name: 'memPercent', label: 'RAM %', color: 'teal.6'}
                    ]}
                    curveType="natural"
                />
                <Divider my='md'/>
                <LineChart
                    h={300}
                    data={statusArr}
                    dataKey="time"
                    withLegend
                    xAxisLabel="Time"
                    xAxisProps={{padding: {left: 10, right: 10}}}
                    legendProps={{verticalAlign: 'bottom', height: 50}}
                    tooltipAnimationDuration={200}
                    unit="MB"
                    series={[
                        {name: 'memLimitMB', label: "RAM Limit", color: 'indigo.6'},
                        {name: 'memUsageMB', label: 'RAM Usage', color: 'teal.6'}
                    ]}
                    curveType="natural"
                />
            </Stack>
        </Card>
    )
}