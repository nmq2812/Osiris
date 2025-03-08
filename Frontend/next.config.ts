import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "voltztoys.ca",
            },
            {
                protocol: "https",
                hostname: "file.hstatic.net",
            },
            {
                protocol: "https",
                hostname: "thehobbyheaven.wordpress.com",
            },
        ],
        domains: [
            "voltztoys.ca",
            "gundamstore.com",
            "cdn.example.com",
            "r.res.easebar.com",
            "product.hstatic.net",
            "down-vn.img.susercontent.com",
            "bizweb.dktcdn.net",
            "pos.nvncdn.com",
        ], // Cách khác
    },
};

export default nextConfig;
