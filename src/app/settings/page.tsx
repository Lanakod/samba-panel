'use client';

import {useEffect, useState} from 'react';
import {Alert, Button, Container, Group, Loader, Stack, TextInput, Title,} from '@mantine/core';
import {useForm} from '@mantine/form';
import {IconAlertTriangle, IconCheck} from '@tabler/icons-react';
import {notifications} from '@mantine/notifications';
import {FetchSettings, UpdateSettings} from "@/api";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<Record<string, string>>({
        initialValues: {},
    });

    // Load settings
    useEffect(() => {
        FetchSettings(setError, setLoading).then(data => {
            if (data) form.setValues(data);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async (values: Record<string, string>) => {
        const result = await UpdateSettings(values, setSaving);

        if (result.status) {
            notifications.show({
                title: 'Settings Updated',
                message: result.message,
                color: 'green',
                icon: <IconCheck size={18}/>,
            });
            form.setValues(result.setting);
        } else {
            notifications.show({
                title: 'Error',
                message: result.message,
                color: 'red',
                icon: <IconAlertTriangle size={18}/>,
            });
        }
    };

    if (loading) {
        return (
            <Container className="py-8">
                <Group justify="center"><Loader/></Group>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-8">
                <Alert color="red" title="Error" icon={<IconAlertTriangle/>}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container size="sm" className="py-8">
            <Title order={2} mb="md">Server Settings (global section)</Title>

            <form onSubmit={form.onSubmit(handleSave)}>
                <Stack>
                    {Object.entries(form.values).map(([key]) => (
                        <TextInput
                            key={key}
                            label={key}
                            {...form.getInputProps(key)}
                        />
                    ))}
                </Stack>

                <Group mt="lg" justify="flex-end">
                    <Button type="submit" loading={saving}>
                        Save Settings
                    </Button>
                </Group>
            </form>
        </Container>
    );
}
