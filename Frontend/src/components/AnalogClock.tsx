"use client";
import { useEffect, useState, useRef } from "react";

const AnalogClock = () => {
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Return null hoặc placeholder khi component chưa được mount
    if (!mounted) {
        return null; // hoặc return một placeholder
    }

    const getRotation = (unit: number, max: number) => (unit / max) * 360;

    const secondsRotation = getRotation(time.getSeconds(), 60);
    const minutesRotation =
        getRotation(time.getMinutes(), 60) + secondsRotation / 60;
    const hoursRotation =
        getRotation(time.getHours() % 12, 12) + minutesRotation / 12;

    const clockNumbers = Array.from({ length: 12 }, (_, i) => {
        const number = i + 1;
        const angle = (number * 30 - 90) * (Math.PI / 180);
        const radius = 80;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return { number, x, y };
    });

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative w-64 h-64 border-4 border-gray-800 rounded-full flex items-center justify-center bg-white">
                {/* Hour markers */}
                {[...Array(60)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-gray-600"
                        style={{
                            width: i % 5 === 0 ? "2px" : "1px",
                            height: i % 5 === 0 ? "10px" : "5px",
                            transform: `rotate(${i * 6}deg) translateY(-110px)`,
                        }}
                    ></div>
                ))}
                {/* Clock numbers */}
                {clockNumbers.map(({ number, x, y }) => (
                    <div
                        key={number}
                        className="absolute text-gray-800 font-bold text-xl"
                        style={{
                            transform: `translate(${x * 1.4}px, ${y * 1.4}px)`,
                        }}
                    >
                        {number}
                    </div>
                ))}

                {/* Clock center point */}
                <div className="absolute w-3 h-3 bg-black rounded-full z-10"></div>

                {/* Hour hand */}
                <div
                    className="absolute bg-black rounded-full"
                    style={{
                        width: "4px",
                        height: "45px",
                        transformOrigin: "bottom center",
                        transform: `translateY(-22px) rotate(${hoursRotation}deg)`,
                        transition:
                            "transform 300ms cubic-bezier(0.4, 2.08, 0.55, 0.44)",
                    }}
                ></div>

                {/* Minute hand */}
                <div
                    className="absolute bg-gray-700 rounded-full"
                    style={{
                        width: "3px",
                        height: "60px",
                        transformOrigin: "bottom center",
                        transform: `translateY(-30px) rotate(${minutesRotation}deg)`,
                        transition:
                            "transform 200ms cubic-bezier(0.4, 2.08, 0.55, 0.44)",
                    }}
                ></div>

                {/* Second hand */}
                <div
                    className="absolute bg-red-500 rounded-full"
                    style={{
                        width: "2px",
                        height: "70px",
                        transformOrigin: "bottom center",
                        transform: `translateY(-35px) rotate(${secondsRotation}deg)`,
                        transition:
                            secondsRotation === 0
                                ? "none"
                                : "transform 0.5s cubic-bezier(0.4, 2.3, 0.3, 1)",
                    }}
                ></div>
            </div>
        </div>
    );
};

export default AnalogClock;
