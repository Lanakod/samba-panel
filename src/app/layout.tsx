import type { Metadata } from "next";
import Script from 'next/script';
import "./globals.css";
import {ColorSchemeScript, MantineColorScheme, mantineHtmlProps, MantineProvider} from '@mantine/core';
import {Shell} from "@/components";
import {cookies} from "next/headers";
import {Notifications} from "@mantine/notifications";
import {ModalsProvider} from "@mantine/modals";
import {FC, ReactNode} from "react";

export const metadata: Metadata = {
    title: "Samba Control Panel",
    description: "Samba Control Panel made by lanakod",
};

type Props = {
    children: ReactNode;
}

const RootLayout: FC<Props> = async ({ children }) => {
    const cookieStore = await cookies();
    const themeCookie = cookieStore.get('color-scheme')?.value;
    const colorScheme: MantineColorScheme = themeCookie === 'light' ? 'light' : 'dark';


    console.log('Server', colorScheme)
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme={colorScheme}/>
        <Script src="/env.js" strategy="beforeInteractive" />
        <meta name="apple-mobile-web-app-title" content="Samba Panel" />
      </head>
      <body>
          <MantineProvider defaultColorScheme={colorScheme}>
              <Notifications />
              <ModalsProvider>
                  <Shell>{children}</Shell>
              </ModalsProvider>
          </MantineProvider>
      </body>
    </html>
  );
}

export default RootLayout;