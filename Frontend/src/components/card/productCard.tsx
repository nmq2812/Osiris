import Link from "next/link";
import { Button } from "../ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "../ui/card";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Badge } from "../ui/badge";

// Component Card Sản phẩm
function ProductCard({ product }: { product?: Product } = {}) {
    if (!product) {
        return (
            <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <p className="text-gray-400">Không có sản phẩm</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
            <div className="relative h-60 bg-gray-100">
                {product.image ? (
                    <Link href={`/products/${product.id}`}>
                        <Image
                            src={product.image[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </Link>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <p className="text-gray-400">Không có hình ảnh</p>
                    </div>
                )}

                <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 rounded-full"
                >
                    <Heart className="h-5 w-5" />
                </Button>
            </div>

            <CardHeader className="pb-2">
                <Link
                    href={`/products/${product.id}`}
                    className="hover:underline"
                >
                    <CardTitle className="text-lg line-clamp-2">
                        {product.name}
                    </CardTitle>
                </Link>
                <CardDescription className="line-clamp-2">
                    {product.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-2 flex-grow">
                <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={16}
                            // className={
                            //     i < product.rating
                            //         ? "text-yellow-400 fill-yellow-400"
                            //         : "text-gray-300"
                            // }
                        />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                        {/* ({product.rating}) */} rating
                    </span>
                </div>

                <div>
                    <Badge variant="outline" className="mr-2">
                        {product.category.name}
                    </Badge>

                    <Badge
                        variant="outline"
                        className="bg-green-50 text-green-600 border-green-200"
                    >
                        Còn hàng
                    </Badge>
                </div>
            </CardContent>

            <CardFooter className="pt-2 flex items-center justify-between border-t border-gray-100">
                <div className="text-lg font-bold">
                    {product.price !== undefined
                        ? product.price.toLocaleString("vi-VN")
                        : "Liên hệ"}
                    ₫
                </div>
                <Button size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Thêm vào giỏ
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ProductCard;
