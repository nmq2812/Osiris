"use client";

import ApplicationConstants from "@/constants/ApplicationConstants";
import React from "react";
import { StompSessionProvider } from "react-stomp-hooks";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <StompSessionProvider
            url={ApplicationConstants.WEBSOCKET_PATH}
            // Optional configs
            debug={(str: string) => {
                console.log(str);
            }}
            // You can add connection headers if needed
            // connectHeaders={{
            //   Authorization: "Bearer your-auth-token"
            // }}
        >
            {children}
        </StompSessionProvider>
    );
}
