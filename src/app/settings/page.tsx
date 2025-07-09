'use client';

import { useEffect, useState } from 'react';
import {
  TextInput,
  Button,
  Title,
  Container,
  Group,
  Loader,
  Alert,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconAlertTriangle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { GetSettingsResponse, CreateSettingResponse } from '@/interfaces';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<Record<string, string>>({
    initialValues: {},
  });

  // Load settings
  useEffect(() => {
    fetch('/api/server/settings')
      .then((res) => res.json() as Promise<GetSettingsResponse>)
      .then((data) => {
        if (data.status) {
          form.setValues(data.settings);
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load settings');
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (values: Record<string, string>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/server/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: values }),
      });

      const result: CreateSettingResponse = await res.json();

      console.log(result)

      if (result.status) {
        notifications.show({
          title: 'Settings Updated',
          message: result.message,
          color: 'green',
          icon: <IconCheck size={18} />,
        });
        form.setValues(result.setting);
      } else {
        notifications.show({
          title: 'Error',
          message: result.message,
          color: 'red',
          icon: <IconAlertTriangle size={18} />,
        });
      }
    } catch (e) {
      console.error(e);
      notifications.show({
        title: 'Network Error',
        message: 'An error occurred while saving settings',
        color: 'red',
        icon: <IconAlertTriangle size={18} />,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-8">
        <Group justify="center"><Loader /></Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <Alert color="red" title="Error" icon={<IconAlertTriangle />}>
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
