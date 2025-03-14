"use client";

import { useState, useEffect } from "react";
import { featuredProducts } from "@/app/mockData";
import FAQSection from "@/components/home/FAQ";
import FeaturedCategoriesSection from "@/components/home/featuredCategories";
import FeaturedProductsSection from "@/components/home/featuredProducts";
import FooterSection from "@/components/home/footer";
import HeaderSection from "@/components/home/header";
import HeroCarouselSection from "@/components/home/heroCarousel";
import InfoTableSection from "@/components/home/infoTable";
import NewsletterSection from "@/components/home/newsLetter";
import SalesAlertSection from "@/components/home/saleAleartSection";
import TestimonialsSection from "@/components/home/testimonials";
import { useAuthStore } from "@/stores/authStore";

export default function HomePage() {
    // State
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <HeaderSection />

            {/* Hero Carousel Section */}
            <HeroCarouselSection />

            {/* Featured Categories Section */}
            <FeaturedCategoriesSection />

            {/* Sales Alert Section */}
            <SalesAlertSection />

            {/* Featured Products Section */}
            <FeaturedProductsSection />

            {/* Info Table Section */}
            <InfoTableSection />

            {/* Newsletter Section */}
            <NewsletterSection />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* FAQ Section */}
            <FAQSection />

            {/* Footer Section */}
            <FooterSection />
        </div>
    );
}
