"use server";

import FAQSection from "@/components/home/FAQ";
import FeaturedCategoriesSection from "@/components/home/featuredCategories";
import FeaturedProductsSection from "@/components/home/featuredProducts";
import FooterSection from "@/components/layout/footer";
import HeaderSection from "@/components/layout/header";
import HeroCarouselSection from "@/components/home/heroCarousel";
import InfoTableSection from "@/components/table/infoTable";
import NewsletterSection from "@/components/home/newsLetter";
import SalesAlertSection from "@/components/home/saleAleartSection";
import TestimonialsSection from "@/components/home/testimonials";

export default async function HomePage() {
    // State
    return (
        <div className="min-h-screen bg-gray-50">
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
        </div>
    );
}
