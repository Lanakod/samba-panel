import {ContainerControls, ServerStatus, Shell} from "@/components";
import {Stack} from "@mantine/core";

export default function Home() {
    return (
        <Shell>
            <Stack w='full'>
                <ServerStatus/>
                <ContainerControls/>
            </Stack>
        </Shell>
    );
}
