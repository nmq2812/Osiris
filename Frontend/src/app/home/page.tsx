"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { categories, carouselData, featuredProducts } from "@/app/mockData";

// Shadcn UI Components
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// Icons
import {
    ShoppingCart,
    Heart,
    Search,
    Star,
    ChevronRight,
    Mail,
    Info,
    AlertTriangle,
} from "lucide-react";
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

export default function HomePage() {
    // State
    const [activeCategory, setActiveCategory] = useState("all");
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Giả lập tải dữ liệu
        setProducts(featuredProducts);
    }, []);

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
            <FeaturedProductsSection
                products={products}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />

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
