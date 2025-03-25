"use client";

import { ReactNode, useState, useEffect } from "react";

// filepath: d:\Osiris\Frontend\src\components\ClientOnly.tsx

export default function ClientOnly({ children }: { children: ReactNode }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return { children };
}
