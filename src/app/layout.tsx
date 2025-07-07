import type { Metadata } from "next";
import Script from 'next/script';
import "./globals.css";
import { ColorSchemeScript, Container, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { ModalsProvider } from "@mantine/modals";

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
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <ModalsProvider>
            <Container fluid p='md' maw="74em">
              {children}
            </Container>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}