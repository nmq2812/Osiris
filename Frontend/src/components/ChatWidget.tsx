"use client";
import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import fs from "fs";

const GEMINI_API_KEY = "AIzaSyDwT8Vll0UKMP3JhaZS8EwHjf1CGanmQLU";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default function ChatWidget() {
    const [open, setOpen] = useState(true);
    const [messages, setMessages] = useState<
        { role: string; content: string }[]
    >([]);
    const [input, setInput] = useState("");

    const mock_product_db = [
        {
            productId: 1,
            productName:
                "30MM Spinatio Army Type - Mô hình Gundam chính hãng Bandai Nhật bản",
            productSlug: "30mm-spinatio-army-type",
            productThumbnail:
                "https://bizweb.dktcdn.net/thumb/1024x1024/100/456/060/products/19ac5616-c650-461a-aaa0-d6b9a07d2eb5-1672166630055.jpg?v=1732093591540",
            productPriceRange: [300000],
            productVariants: [
                {
                    variantId: 1,
                    variantPrice: 300000,
                    variantProperties: {
                        content: [
                            {
                                id: 1,
                                code: "size",
                                name: "Kích cỡ",
                                value: "29.8 x 18.8 x 4.7 cm",
                            },
                            {
                                id: 2,
                                code: "color",
                                name: "Màu sắc",
                                value: "Xanh lá",
                            },
                            {
                                id: 3,
                                code: "material",
                                name: "Chất liệu",
                                value: "Nhựa ABS",
                            },
                        ],
                        totalElements: 3,
                    },
                },
            ],
            productSaleable: true,
            productPromotion: null,
        },
        {
            productId: 2,
            productName:
                "HG Gundam Aerial - Mô hình chính hãng Bandai, chi tiết cao",
            productSlug: "hg-gundam-aerial",
            productThumbnail: "https://example.com/images/hg-gundam-aerial.jpg",
            productPriceRange: [450000],
            productVariants: [
                {
                    variantId: 2,
                    variantPrice: 450000,
                    variantProperties: {
                        content: [
                            {
                                id: 4,
                                code: "size",
                                name: "Kích cỡ",
                                value: "30 x 20 x 6 cm",
                            },
                            {
                                id: 5,
                                code: "color",
                                name: "Màu sắc",
                                value: "Trắng xanh",
                            },
                            {
                                id: 6,
                                code: "material",
                                name: "Chất liệu",
                                value: "Nhựa ABS & PC",
                            },
                        ],
                        totalElements: 3,
                    },
                },
            ],
            productSaleable: true,
            productPromotion: {
                discount: "10%",
                note: "Giảm giá nhân dịp ra mắt",
            },
        },
        {
            productId: 3,
            productName:
                "MG Gundam Barbatos - Mô hình Gundam tỉ lệ 1/100 cao cấp",
            productSlug: "mg-gundam-barbatos",
            productThumbnail: "https://example.com/images/mg-barbatos.jpg",
            productPriceRange: [950000],
            productVariants: [
                {
                    variantId: 3,
                    variantPrice: 950000,
                    variantProperties: {
                        content: [
                            {
                                id: 7,
                                code: "size",
                                name: "Kích cỡ",
                                value: "38 x 25 x 8 cm",
                            },
                            {
                                id: 8,
                                code: "color",
                                name: "Màu sắc",
                                value: "Trắng xám",
                            },
                            {
                                id: 9,
                                code: "material",
                                name: "Chất liệu",
                                value: "ABS cao cấp",
                            },
                        ],
                        totalElements: 3,
                    },
                },
            ],
            productSaleable: true,
            productPromotion: null,
        },
        {
            productId: 4,
            productName:
                "SD Gundam Ex-Standard RX-78-2 - Dòng mô hình SD dễ lắp ráp",
            productSlug: "sd-ex-standard-rx-78-2",
            productThumbnail: "https://example.com/images/sd-rx-78-2.jpg",
            productPriceRange: [180000],
            productVariants: [
                {
                    variantId: 4,
                    variantPrice: 180000,
                    variantProperties: {
                        content: [
                            {
                                id: 10,
                                code: "size",
                                name: "Kích cỡ",
                                value: "15 x 10 x 4 cm",
                            },
                            {
                                id: 11,
                                code: "color",
                                name: "Màu sắc",
                                value: "Trắng đỏ xanh",
                            },
                            {
                                id: 12,
                                code: "material",
                                name: "Chất liệu",
                                value: "Nhựa mềm",
                            },
                        ],
                        totalElements: 3,
                    },
                },
            ],
            productSaleable: true,
            productPromotion: {
                discount: "5%",
                note: "Khuyến mãi hè",
            },
        },
        {
            productId: 101,
            productName:
                "Figure Luffy - One Piece Gear 5 (Banpresto - Chính hãng)",
            productSlug: "figure-luffy-gear-5",
            productThumbnail: "https://example.com/images/luffy-gear5.jpg",
            productPriceRange: [650000],
            productVariants: [
                {
                    variantId: 1011,
                    variantPrice: 650000,
                    variantProperties: {
                        content: [
                            {
                                id: 201,
                                code: "size",
                                name: "Kích cỡ",
                                value: "20 x 12 x 10 cm",
                            },
                            {
                                id: 202,
                                code: "color",
                                name: "Màu sắc",
                                value: "Trắng, đỏ, vàng",
                            },
                            {
                                id: 203,
                                code: "material",
                                name: "Chất liệu",
                                value: "PVC cao cấp",
                            },
                        ],
                        totalElements: 3,
                    },
                },
            ],
            productSaleable: true,
            productPromotion: {
                discount: "15%",
                note: "Ưu đãi giới hạn",
            },
        },
        {
            productId: 102,
            productName: "Figure Nezuko Kamado - Kimetsu no Yaiba chính hãng",
            productSlug: "figure-nezuko-kamado",
            productThumbnail: "https://example.com/images/nezuko.jpg",
            productPriceRange: [480000],
            productVariants: [
                {
                    variantId: 1012,
                    variantPrice: 480000,
                    variantProperties: {
                        content: [
                            {
                                id: 204,
                                code: "size",
                                name: "Kích cỡ",
                                value: "18 x 10 x 9 cm",
                            },
                            {
                                id: 205,
                                code: "color",
                                name: "Màu sắc",
                                value: "Hồng đen",
                            },
                            {
                                id: 206,
                                code: "material",
                                name: "Chất liệu",
                                value: "PVC + ABS",
                            },
                        ],
                        totalElements: 3,
                    },
                },
            ],
            productSaleable: true,
            productPromotion: null,
        },
        {
            productId: 103,
            productName: "Figure Gojo Satoru - Jujutsu Kaisen Limited Edition",
            productSlug: "figure-gojo-satoru",
            productThumbnail: "https://example.com/images/gojo.jpg",
            productPriceRange: [790000],
            productVariants: [
                {
                    variantId: 1013,
                    variantPrice: 790000,
                    variantProperties: {
                        content: [
                            {
                                id: 207,
                                code: "size",
                                name: "Kích cỡ",
                                value: "22 x 14 x 12 cm",
                            },
                            {
                                id: 208,
                                code: "color",
                                name: "Màu sắc",
                                value: "Tím đen",
                            },
                            {
                                id: 209,
                                code: "material",
                                name: "Chất liệu",
                                value: "Resin",
                            },
                        ],
                        totalElements: 3,
                    },
                },
            ],
            productSaleable: true,
            productPromotion: {
                discount: "20%",
                note: "Phiên bản giới hạn",
            },
        },
    ];

    const chat = ai.chats.create({
        model: "gemini-2.0-flash-001",
        history: [
            {
                role: "user",
                parts: [
                    {
                        text:
                            "giẩ sử tôi là khách hàng còn bạn là một chatbox hỗ trợ tôi mua gundam và figure với các thông tin sau:" +
                            mock_product_db.toString(),
                    },
                ],
            },
            {
                role: "model",
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
                message: "Trả lời ngắn gọn với câu hỏi:" + input,
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
                    className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
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
