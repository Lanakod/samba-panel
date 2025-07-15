import type { Metadata } from "next";
import {FC, ReactNode} from "react";
import {Center} from "@mantine/core";

export const metadata: Metadata = {
    title: "Samba Panel | Auth",
    description: "Samba Control Panel made by lanakod",
};

type Props = {
    children: ReactNode;
}

const UsersLayout: FC<Props> = async ({ children }) => {
  return (
      <Center>
          {children}
      </Center>
  );
}

export default UsersLayout;