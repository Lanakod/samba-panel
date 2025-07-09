'use client'
import { FC, ReactNode } from "react";
import { AppShell, Burger, Button, Image, NavLink, Stack } from '@mantine/core'
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight, IconClipboardData, IconFolders, IconServer, IconSettings, IconUsers } from "@tabler/icons-react";
import Link from 'next/link'

const { Header, Navbar, Main} = AppShell

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
    const [opened, { toggle, close }] = useDisclosure();

    return (
        <AppShell
        header={{ height: 60 }}
        navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
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
                        rightSection={<IconChevronRight size={12} stroke={1.5} className="mantine-rotate-rtl" />}
                        variant="subtle"
                        active
                        onClick={close}
                        component={Link}
                    />)
                }
            </Stack>
            <Button disabled>Change Color Scheme</Button>
        </Navbar>

        <Main>{children}</Main>
        </AppShell>
    )
}