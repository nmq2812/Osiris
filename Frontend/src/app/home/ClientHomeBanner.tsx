"use client";
import React from "react";
import Image from "next/image";
import ClientCarousel from "@/components/ClientCarousel";
import Link from "next/link";

// Cấu trúc dữ liệu cho banner
interface BannerItem {
    id: number;
    imageUrl: string;
    alt: string;
    title: string;
    description: string;
}

const bannerData: BannerItem[] = [
    {
        id: 1,
        imageUrl:
            "https://file.hstatic.net/1000190106/collection/new_site_banner_mg_c9fbad1bc0a443ad8852f5959ad428ad.jpg", // Thay đổi đường dẫn phù hợp
        alt: "Khuyến mãi mùa hè",
        title: "Khuyến mãi mùa hè",
        description: "Giảm giá đến 50% cho tất cả sản phẩm mùa hè",
    },
    {
        id: 2,
        imageUrl:
            "https://file.hstatic.net/200000838897/article/gk-figure-banner_5cfd73eb18ae47899865e6a695ac6d1d.jpg", // Thay đổi đường dẫn phù hợp
        alt: "Bộ sưu tập mới",
        title: "Bộ sưu tập mới 2025",
        description: "Khám phá những sản phẩm mới nhất của chúng tôi",
    },
];

const ClientHomeBanner = () => {
    return (
        <div className="w-full max-w-7xl mx-auto my-6">
            <ClientCarousel>
                {bannerData.map((banner) => (
                    <div key={banner.id} className="relative w-full h-[400px]">
                        {/* Sử dụng div thay vì Image nếu bạn chưa có hình ảnh thực */}
                        <div
                            className="w-full h-full bg-gray-200 flex items-center justify-center"
                            style={{
                                backgroundImage: `url(${banner.imageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            {/* Lớp overlay cho text */}
                            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-8">
                                <h2 className="text-4xl font-bold mb-4">
                                    {banner.title}
                                </h2>
                                <p className="text-lg mb-6 max-w-lg text-center">
                                    {banner.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </ClientCarousel>
        </div>
    );
};

export default ClientHomeBanner;
