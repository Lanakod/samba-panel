'use client'

import {FC} from "react";
import {Button, Card, Group, Text} from "@mantine/core";
import {IconAlertTriangle, IconCheck, IconPlayerPlay, IconRefresh, IconSquare} from "@tabler/icons-react";
import {SendCommandResponse} from "@/interfaces";
import {notifications} from "@mantine/notifications";

const {Section: CardSection} = Card

type Action = 'stop' | 'start' | 'restart'

const SendCommand = async (action: Action) => {
    const res = await fetch(`/api/server/${action}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        }
    })
    const data: SendCommandResponse = await res.json()
    if (data.status) {
        notifications.show({
            title: 'Command sent',
            message: data.message,
            color: 'green',
            icon: <IconCheck size={18}/>,
        });
    } else {
        notifications.show({
            title: 'Error',
            message: data.message,
            color: 'red',
            icon: <IconAlertTriangle size={18}/>,
        });
    }
}

export const ContainerControls: FC = () => {
    return (
        <Card withBorder shadow="sm" radius="md">
            <CardSection withBorder inheritPadding py="xs">
                <Text fw={500}>Container Controls</Text>
            </CardSection>
            <Group mt="md">
                <Button leftSection={<IconRefresh size="16"/>} variant="light"
                        onClick={() => SendCommand('restart')}>Restart</Button>
                <Button leftSection={<IconSquare size="16"/>} variant="light" color="red"
                        onClick={() => SendCommand('stop')}>Stop</Button>
                <Button leftSection={<IconPlayerPlay size="16"/>} variant="light" color="green"
                        onClick={() => SendCommand('start')}>Start</Button>
            </Group>
        </Card>
    )
}