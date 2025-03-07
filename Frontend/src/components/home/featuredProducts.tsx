import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Badge, Heart, Star, ShoppingCart, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
    CardFooter,
} from "../ui/card";
import Image from "next/image";

interface FeaturedProductsSectionProps {
    products: Product[];
    activeCategory: string;
    setActiveCategory: (category: string) => void;
}

export default function FeaturedProductsSection({
    products,
    activeCategory,
    setActiveCategory,
}: FeaturedProductsSectionProps) {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h2 className="text-3xl font-bold mb-4 md:mb-0">
                    Sản phẩm nổi bật
                </h2>
                <Tabs
                    value={activeCategory}
                    onValueChange={setActiveCategory}
                    className="w-full md:w-auto"
                >
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                        <TabsTrigger value="gundam">Gundam</TabsTrigger>
                        <TabsTrigger value="anime">Anime</TabsTrigger>
                        <TabsTrigger value="mecha">Mecha</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products
                    .filter(
                        (product: any) =>
                            activeCategory === "all" ||
                            product.category === activeCategory,
                    )
                    .map((product: any) => (
                        <Card
                            key={product.id}
                            className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="relative">
                                <div className="h-64 overflow-hidden">
                                    <Image
                                        src={
                                            product.image ||
                                            "/images/placeholder.jpg"
                                        }
                                        alt={product.name}
                                        width={500}
                                        height={300}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {product.sale && (
                                    <Badge className="absolute top-4 left-4 bg-red-500">
                                        SALE
                                    </Badge>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full"
                                >
                                    <Heart className="h-5 w-5" />
                                </Button>
                            </div>

                            <CardContent className="p-6">
                                <div className="flex items-center mb-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${
                                                    i <
                                                    Math.floor(product.rating)
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 ml-2">
                                        {product.rating}
                                    </span>
                                </div>

                                <CardTitle className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer">
                                    {product.name}
                                </CardTitle>

                                <CardDescription className="text-gray-600 mb-4">
                                    {product.description}
                                </CardDescription>

                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-blue-600">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(product.price)}
                                    </span>
                                </div>
                            </CardContent>

                            <CardFooter className="flex gap-2 p-6 pt-0">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    Mua ngay
                                </Button>
                                <Button variant="outline" size="icon">
                                    <ShoppingCart className="h-5 w-5" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
            </div>

            <div className="text-center mt-10">
                <Button variant="outline" className="px-8">
                    Xem tất cả sản phẩm{" "}
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </section>
    );
}
