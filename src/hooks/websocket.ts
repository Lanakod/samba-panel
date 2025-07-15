'use client';

import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url: string | null) {
    const ref = useRef<WebSocket | null>(null);
    const [, setRefresh] = useState(0);

    useEffect(() => {
        if (!url || ref.current) return;

        const socket = new WebSocket(url);
        ref.current = socket;
        setRefresh(v => v + 1);

        return () => socket.close();
    }, [url]);

    return ref.current;
}
