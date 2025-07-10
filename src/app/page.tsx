import {ContainerControls, ServerStatus} from "@/components";
import {Stack} from "@mantine/core";

export default function Home() {
    return (
        <Stack w='full'>
            <ServerStatus/>
            <ContainerControls/>
        </Stack>
    );
}
