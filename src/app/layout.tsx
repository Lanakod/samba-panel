import type { Metadata } from "next";
import Script from 'next/script';
import "./globals.css";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { ModalsProvider } from "@mantine/modals";
import { Shell } from "@/components";
import { Notifications } from "@mantine/notifications";

export const metadata: Metadata = {
  title: "Samba Control Panel",
  description: "Samba Control Panel made by lanakod",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <Script src="/env.js" strategy="beforeInteractive" />
        <meta name="apple-mobile-web-app-title" content="Samba Panel" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <Notifications />
          <ModalsProvider>
            <Shell>{children}</Shell>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}