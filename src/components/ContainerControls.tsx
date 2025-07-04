'use client'

import { FC } from "react";
import { Button, Card, Group, Text } from "@mantine/core";
import { IconPlayerPlay, IconRefresh, IconSquare } from "@tabler/icons-react";

const {Section: CardSection} = Card

type Action = 'stop' | 'start' | 'restart'

const SendCommand = async (action: Action) => {
    await fetch(`/api/server/${action}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        }
    })
}

export const ContainerControls: FC = () => {
    return (
        <Card withBorder shadow="sm" radius="md">
            <CardSection withBorder inheritPadding py="xs">
                <Text fw={500}>Container Controls</Text>
            </CardSection>
            <Group mt="md">
                <Button leftSection={<IconRefresh size="16"/>} variant="light" onClick={() => SendCommand('restart')}>Restart</Button>
                <Button leftSection={<IconSquare size="16"/>} variant="light" color="red" onClick={() => SendCommand('stop')}>Stop</Button>
                <Button leftSection={<IconPlayerPlay size="16"/>} variant="light" color="green" onClick={() => SendCommand('start')}>Start</Button>
            </Group>
        </Card>
    )
}