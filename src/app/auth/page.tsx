'use client'
import {
    Button, Center,
    Group,
    Paper,
    PasswordInput,
    Stack,
    TextInput, Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {zodResolver} from "mantine-form-zod-resolver";
import {AuthSchema} from "@/schemas";
import {useRouter} from "next/navigation";
import {Authenticate} from "@/api";

export default function AuthPage() {
    const authForm = useForm({
        initialValues: {
            username: '',
            password: '',
        },

        validate: zodResolver(AuthSchema),
    });
    const router = useRouter();

    return (
        <Center w='full' h='100vh'>
            <Stack gap='md'>
                <Title ta="center" fw={500}>
                    Welcome to Samba Panel
                </Title>

                <Paper radius="md" p="lg" withBorder>
                    <form onSubmit={authForm.onSubmit(async ({username, password}) => {
                        const res = await Authenticate(username, password);
                        if(res) router.push('/');
                    })}>
                        <Stack>
                            <TextInput
                                required
                                label="Username"
                                placeholder="Bob"
                                radius="md"
                                key={authForm.key('username')}
                                {...authForm.getInputProps('username')}
                            />

                            <PasswordInput
                                required
                                label="Password"
                                placeholder="Your password"
                                radius="md"
                                key={authForm.key('password')}
                                {...authForm.getInputProps('password')}
                            />
                        </Stack>

                        <Group justify="space-between" mt="xl">
                            <Button type="submit" radius="xl">
                                Sign in
                            </Button>
                        </Group>
                    </form>
                </Paper>
            </Stack>
        </Center>
    );
}