"use client";

import Image from "next/image";
import Link from "next/link";

export default function OsirisLogo() {
    return (
        <div className="flex items-center">
            <Image
                src="/logo.png"
                alt="Osiris Logo"
                width={40}
                height={40}
                className="mr-2"
                priority
            />
            <span className="text-xl font-bold text-blue-600 md:text-2xl">
                OSIRIS
            </span>
        </div>
    );
}
