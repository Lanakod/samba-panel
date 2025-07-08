import { ContainerControls, ServerLogs, ServerStatus, SharesList, UserList } from "@/components";
import { Stack } from "@mantine/core";

export default function Home() {
  return (
    <Stack w='full'>
      <ServerStatus/>
      <ContainerControls/>
      <ServerLogs/>
      <UserList/>
      <SharesList/>
    </Stack>
  );
}
