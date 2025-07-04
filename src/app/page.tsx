import { ContainerControls, ServerStatus, SharesList, UserList } from "@/components";
import { Stack } from "@mantine/core";

export default function Home() {
  return (
    <Stack w='full'>
      <ServerStatus/>
      <ContainerControls/>
      <UserList/>
      <SharesList/>
    </Stack>
  );
}
