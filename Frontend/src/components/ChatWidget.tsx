"use client";
import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
import { MessageCircle } from "lucide-react";

const GEMINI_API_KEY = "AIzaSyDwT8Vll0UKMP3JhaZS8EwHjf1CGanmQLU";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default function ChatWidget() {
    const [open, setOpen] = useState(true);
    const [messages, setMessages] = useState<
        { role: string; content: string }[]
    >([]);
    const [input, setInput] = useState("");

    const chat = ai.chats.create({
        model: "gemini-2.0-flash-001",
        history: [
            {
                role: "user",
                parts: [
                    {
                        text: "bạn là một chatbox hỗ trợ tôi mua gundam và figure",
                    },
                ],
            },
        ],
    });

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");

        try {
            const res = await chat.sendMessage({
                message:
                    "bạn là một chatbox hỗ trợ tôi mua gundam và figure. Trả lười ngắn gọn với câu hỏi:" +
                    input,
            });

            // Trích xuất nội dung từ phản hồi
            const assistantMessage = res.text;

            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: assistantMessage ? assistantMessage : "",
                },
            ]);
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
                },
            ]);
        }
    };

    // Hàm reset đoạn chat
    const resetChat = () => {
        setMessages([]);
    };

    return (
        <>
            {/* Bong bóng chat */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setOpen(!open)}
                    className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition"
                >
                    <MessageCircle />
                </button>
            </div>

            {/* Hộp chat */}
            {open && (
                <div className="fixed bottom-20 right-6 w-80 h-96 bg-white border shadow-2xl rounded-xl flex flex-col z-50">
                    <div className="p-3 border-b text-center font-semibold bg-blue-500 text-white rounded-t-xl">
                        Hỗ trợ AI
                    </div>
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-1 space-y-2 text-sm">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded-lg w-60 ${
                                    msg.role === "user"
                                        ? "bg-blue-200 text-right ml-auto w-75"
                                        : "bg-gray-100 text-left mr-auto w-75"
                                }`}
                            >
                                {msg.content}
                            </div>
                        ))}
                    </div>
                    <div className="p-2 border-t flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 border rounded px-3 py-1 text-sm"
                            placeholder="Nhập câu hỏi..."
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
                        >
                            Gửi
                        </button>
                        <button
                            onClick={resetChat}
                            className="bg-gray-500 text-white px-3 rounded hover:bg-gray-400"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
