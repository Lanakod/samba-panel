'use client'
import {FC, ReactNode, useEffect} from "react";
import {AppShell, Burger, Button, Center, Image, NavLink, Stack, Text, useMantineColorScheme} from '@mantine/core'
import {useDisclosure} from "@mantine/hooks";
import {
    IconChevronRight,
    IconClipboardData,
    IconFolders,
    IconMoon,
    IconServer,
    IconSettings,
    IconSun,
    IconUsers
} from "@tabler/icons-react";
import Link from 'next/link'
import {notifications} from "@mantine/notifications";

const {Header, Navbar, Main} = AppShell

type Props = {
    children: ReactNode
}

type Link = {
    href: string
    title: string
    icon: ReactNode
}

const links: Link[] = [
    {
        href: '/',
        title: 'Status',
        icon: <IconServer/>
    },
    {
        href: 'logs',
        title: 'Logs',
        icon: <IconClipboardData/>
    },
    {
        href: 'settings',
        title: 'Settings',
        icon: <IconSettings/>
    },
    {
        href: 'users',
        title: 'Users',
        icon: <IconUsers/>
    },
    {
        href: 'shares',
        title: 'Shares',
        icon: <IconFolders/>
    },
]

export const Shell: FC<Props> = ({children}) => {
    const [opened, {toggle, close}] = useDisclosure();
    const {setColorScheme, colorScheme} = useMantineColorScheme()

    const toggleColorScheme = () => {
        const nextScheme = colorScheme === 'light' ? 'dark' : 'light'
        setColorScheme(nextScheme)
        document.cookie = `color-scheme=${nextScheme}; path=/; max-age=31536000` // 1 year
    }

    useEffect(() => {
        let buffer = '';

        const onKeyDown = (e: KeyboardEvent) => {
            buffer += e.key.toUpperCase();
            if (buffer.length > 10) buffer = buffer.slice(-10);
            if (buffer.includes('IDDQD')) {
                notifications.show({
                    title: 'God Mode Activated',
                    message: 'You are now invincible!',
                    color: 'yellow'
                });
                console.log('💥 IDDQD activated');
                buffer = '';
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <AppShell
            header={{height: 60}}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: {mobile: !opened},
            }}
            padding="md"
        >
            <Header style={{
                display: 'flex',
                alignItems: 'center',
                padding: '5px'
            }}>
                <Image h="3rem" w='auto' src='/icon0.svg' alt="Samba Panel Logo"/>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />
            </Header>

            <Navbar p="md" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Stack>
                    {
                        links.map((link, i) => <NavLink
                            key={i}
                            href={link.href}
                            label={link.title}
                            leftSection={link.icon}
                            rightSection={<IconChevronRight size={12} stroke={1.5} className="mantine-rotate-rtl"/>}
                            variant="subtle"
                            active
                            onClick={close}
                            component={Link}
                        />)
                    }
                </Stack>
                <Stack>
                    <Button
                        onClick={toggleColorScheme}
                        variant='light'
                        aria-label='Toggle Color Scheme'
                        leftSection={colorScheme === 'light' ? <IconMoon stroke={1.5}/> : <IconSun stroke={1.5}/>}
                    >
                        Toggle Color Scheme
                    </Button>
                    <Center>
                        <Text size='sm' c='dimmed'>v0.2.1</Text>
                    </Center>
                </Stack>
            </Navbar>

            <Main>{children}</Main>
        </AppShell>
    )
}