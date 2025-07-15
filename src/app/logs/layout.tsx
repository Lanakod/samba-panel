import type { Metadata } from "next";
import {Shell} from "@/components";
import {FC, ReactNode} from "react";

export const metadata: Metadata = {
    title: "Samba Panel | Logs",
    description: "Samba Control Panel made by lanakod",
};

type Props = {
    children: ReactNode;
}

const UsersLayout: FC<Props> = async ({ children }) => {
  return (
      <Shell>
          {children}
      </Shell>
  );
}

export default UsersLayout;