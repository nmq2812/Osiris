"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2, Search, ShoppingCart, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Định nghĩa kiểu dữ liệu sản phẩm
interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    category: string;
    rating: number;
    inStock: boolean;
    discount?: number;
}

function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Trạng thái bộ lọc và sắp xếp
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("popular");

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;
    const categories = [
        "Gundam",
        "Mô hình anime",
        "Phụ kiện",
        "Sách",
        "Đồ chơi",
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts();

                // Kiểm tra và trích xuất mảng sản phẩm từ dữ liệu phản hồi
                let productsArray = [];

                if (Array.isArray(response)) {
                    productsArray = response;
                } else if (response && typeof response === "object") {
                    // Trường hợp 1: data có thể nằm trong response.data
                    if (Array.isArray(response.data)) {
                        productsArray = response.data;
                    }
                    // Trường hợp 2: data có thể nằm trong response.content
                    else if (Array.isArray(response.content)) {
                        productsArray = response.content;
                    }
                    // Trường hợp 3: data có thể nằm trong response.items
                    else if (Array.isArray(response.items)) {
                        productsArray = response.items;
                    }
                    // Trường hợp 4: Đối tượng có thể chứa danh sách sản phẩm ở cấp sâu hơn
                    else if (
                        response.data &&
                        Array.isArray(response.data.content)
                    ) {
                        productsArray = response.data.content;
                    }
                }

                // Ghi nhật ký để kiểm tra
                console.log("API response:", response);
                console.log("Extracted products:", productsArray);

                // Cập nhật state với mảng đã trích xuất
                setProducts(productsArray);
                setFilteredProducts(productsArray);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError(
                    "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau!",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Lọc và sắp xếp sản phẩm
    useEffect(() => {
        let result = [...(products || [])];

        // Lọc theo tìm kiếm
        if (searchTerm) {
            result = result.filter(
                (product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    product.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
            );
        }

        // Lọc theo danh mục
        if (selectedCategory !== "all") {
            result = result.filter(
                (product) => product.category === selectedCategory,
            );
        }

        // Sắp xếp
        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "newest":
                // Giả sử sản phẩm mới nhất có ID cao nhất
                result.sort((a, b) => b.id - a.id);
                break;
            case "popular":
            default:
                // Sắp xếp theo đánh giá
                result.sort((a, b) => b.rating - a.rating);
                break;
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reset về trang đầu tiên khi lọc
    }, [searchTerm, selectedCategory, sortBy, products]);

    // Tính toán phân trang
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct,
    );
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Xử lý chuyển trang
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Hiển thị trạng thái loading
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                <p className="text-lg text-gray-600">
                    Đang tải danh sách sản phẩm...
                </p>
            </div>
        );
    }

    // Hiển thị trạng thái lỗi
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-red-500 text-center max-w-md">
                    <h3 className="text-2xl font-bold mb-4">Có lỗi xảy ra</h3>
                    <p>{error}</p>
                    <Button
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Danh sách sản phẩm</h1>

            {/* Thanh tìm kiếm và lọc */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                    />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả danh mục</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sắp xếp theo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="popular">
                                Phổ biến nhất
                            </SelectItem>
                            <SelectItem value="newest">Mới nhất</SelectItem>
                            <SelectItem value="price-asc">
                                Giá: Thấp đến cao
                            </SelectItem>
                            <SelectItem value="price-desc">
                                Giá: Cao đến thấp
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Tabs danh mục */}
            <Tabs defaultValue="all" className="mb-8">
                <TabsList className="mb-4">
                    <TabsTrigger
                        value="all"
                        onClick={() => setSelectedCategory("all")}
                    >
                        Tất cả
                    </TabsTrigger>
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category}
                            value={category}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Kết quả tìm kiếm */}
            <div className="mb-4 text-gray-600">
                Hiển thị {filteredProducts.length} sản phẩm
            </div>

            {/* Lưới sản phẩm */}
            {currentProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-600">
                        Không tìm thấy sản phẩm nào phù hợp.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* Phân trang */}
            {filteredProducts.length > productsPerPage && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() =>
                                    currentPage > 1 && paginate(currentPage - 1)
                                }
                                className={
                                    currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }
                            />
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    isActive={currentPage === i + 1}
                                    onClick={() => paginate(i + 1)}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() =>
                                    currentPage < totalPages &&
                                    paginate(currentPage + 1)
                                }
                                className={
                                    currentPage === totalPages
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}

// Component Card Sản phẩm
function ProductCard({ product }: { product: Product }) {
    return (
        <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
            <div className="relative h-60 bg-gray-100">
                {product.imageUrl ? (
                    <Link href={`/products/${product.id}`}>
                        <Image
                            src={product.imageUrl}
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

                {product.discount && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                        -{product.discount}%
                    </Badge>
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
                            className={
                                i < product.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                            }
                        />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                        ({product.rating})
                    </span>
                </div>

                <div>
                    <Badge variant="outline" className="mr-2">
                        {product.category.name}
                    </Badge>
                    {product.inStock ? (
                        <Badge
                            variant="outline"
                            className="bg-green-50 text-green-600 border-green-200"
                        >
                            Còn hàng
                        </Badge>
                    ) : (
                        <Badge
                            variant="outline"
                            className="bg-red-50 text-red-600 border-red-200"
                        >
                            Hết hàng
                        </Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-2 flex items-center justify-between border-t border-gray-100">
                <div className="text-lg font-bold">
                    {product.price !== undefined
                        ? product.price.toLocaleString("vi-VN")
                        : "Liên hệ"}
                    ₫
                </div>
                <Button size="sm" disabled={!product.inStock}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Thêm vào giỏ
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ProductsPage;
