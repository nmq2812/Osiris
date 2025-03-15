// Các import từ shadcn UI
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Các import từ thư viện biểu tượng
import { Search, Heart, ShoppingCart } from "lucide-react";

// Các import từ Next.js
import Link from "next/link";
import Image from "next/image";

export default function HeaderSection() {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo.png"
                                alt="Osiris Logo"
                                width={40}
                                height={40}
                                className="mr-2"
                            />
                            <span className="text-2xl font-bold text-blue-600">
                                OSIRIS
                            </span>
                        </Link>
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-gray-900 hover:text-blue-600 text-sm font-medium"
                        >
                            Trang chủ
                        </Link>
                        <Link
                            href="/products"
                            className="text-gray-600 hover:text-blue-600 text-sm font-medium"
                        >
                            Sản phẩm
                        </Link>
                        <Link
                            href="/categories"
                            className="text-gray-600 hover:text-blue-600 text-sm font-medium"
                        >
                            Danh mục
                        </Link>
                        <Link
                            href="/sales"
                            className="text-gray-600 hover:text-blue-600 text-sm font-medium"
                        >
                            Khuyến mãi
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-600 hover:text-blue-600 text-sm font-medium"
                        >
                            Giới thiệu
                        </Link>
                    </nav>

                    {/* Search and Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="flex space-x-2">
                                    <Input placeholder="Tìm kiếm sản phẩm..." />
                                    <Button size="sm">Tìm</Button>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Wishlist */}
                        <Button variant="outline" size="icon">
                            <Heart className="h-4 w-4" />
                        </Button>

                        {/* Cart */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="relative"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-blue-600">
                                        3
                                    </Badge>
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Giỏ hàng của bạn</SheetTitle>
                                    <SheetDescription>
                                        Bạn đang có 3 sản phẩm trong giỏ hàng
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-8">
                                    {/* Cart items would go here */}
                                    <div className="flex justify-between mt-8">
                                        <span>Tổng cộng:</span>
                                        <span className="font-bold">
                                            3,050,000 VND
                                        </span>
                                    </div>
                                    <Button className="w-full mt-4">
                                        Thanh toán
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Mobile menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="md:hidden"
                                >
                                    <span className="sr-only">Open menu</span>
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col space-y-4 mt-6">
                                    <Link
                                        href="/"
                                        className="text-gray-900 hover:text-blue-600 text-sm font-medium"
                                    >
                                        Trang chủ
                                    </Link>
                                    <Link
                                        href="/products"
                                        className="text-gray-600 hover:text-blue-600 text-sm font-medium"
                                    >
                                        Sản phẩm
                                    </Link>
                                    <Link
                                        href="/categories"
                                        className="text-gray-600 hover:text-blue-600 text-sm font-medium"
                                    >
                                        Danh mục
                                    </Link>
                                    <Link
                                        href="/sales"
                                        className="text-gray-600 hover:text-blue-600 text-sm font-medium"
                                    >
                                        Khuyến mãi
                                    </Link>
                                    <Link
                                        href="/about"
                                        className="text-gray-600 hover:text-blue-600 text-sm font-medium"
                                    >
                                        Giới thiệu
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
