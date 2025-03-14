"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Tạo phần giữ chỗ khi đồng hồ đang được tải
const ClockPlaceholder = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="w-64 h-64 border-4 border-gray-800 rounded-full flex items-center justify-center bg-white">
            <span>Loading clock...</span>
        </div>
    </div>
);

// Import động với ssr: false để tránh lỗi hydration
const DynamicClock = dynamic(() => import("@/components/AnalogClock"), {
    ssr: false,
    loading: () => <ClockPlaceholder />,
});

export default function ClockPage() {
    return (
        <Suspense fallback={<ClockPlaceholder />}>
            <DynamicClock />
        </Suspense>
    );
}
