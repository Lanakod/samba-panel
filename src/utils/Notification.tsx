import {notifications} from "@mantine/notifications";
import {IconAlertTriangle, IconCheck} from "@tabler/icons-react";
import {createElement} from "react";


const success = (title: string, message: string) => notifications.show({
    title,
    message,
    color: 'green',
    icon: createElement(IconCheck, { size: 18 }),
});

const error = (title: string, message: string) => notifications.show({
    title,
    message,
    color: 'red',
    icon: createElement(IconAlertTriangle, { size: 18 }),
})

export const notification = {
    success,
    error
}