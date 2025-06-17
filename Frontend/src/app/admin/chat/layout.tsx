"use client";
import ApplicationConstants from "@/constants/ApplicationConstants";
import { ReactNode, useEffect, useState } from "react";
import { StompSessionProvider } from "react-stomp-hooks";

// ClientOnly wrapper để tránh SSR errors với thư viện WebSocket
function ClientOnly({ children }: { children: ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;
    return <>{children}</>;
}

export default function ChatLayout({ children }: { children: ReactNode }) {
    return (
        <ClientOnly>
            <StompSessionProvider
                url={ApplicationConstants.WEBSOCKET_PATH}
                debug={(str) => {
                    console.log("STOMP Debug:", str);
                }}
                onConnect={() => {
                    console.log("STOMP Connected");
                }}
                onDisconnect={() => {
                    console.log("STOMP Disconnected");
                }}
                onStompError={(frame) => {
                    console.error("STOMP Error:", frame);
                }}
                connectionTimeout={10000} // 10 seconds
            >
                {children}
            </StompSessionProvider>
        </ClientOnly>
    );
}
