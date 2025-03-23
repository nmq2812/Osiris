"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
// Định nghĩa kiểu dữ liệu cho giỏ hàng
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    available: number; // Số lượng tồn kho
}

export default function CartPage() {
    const router = useRouter();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState("");

    // Giả lập việc lấy dữ liệu giỏ hàng
    useEffect(() => {
        // Trong thực tế, dữ liệu này sẽ được lấy từ localStorage, context API hoặc từ backend
        const fetchCartItems = () => {
            setLoading(true);
            // Giả lập việc lấy dữ liệu từ backend
            const sampleCartItems = [
                {
                    id: 1,
                    name: "Gundam RX-78-2 Ver.Ka",
                    price: 1200000,
                    quantity: 1,
                    image: "",
                    available: 5,
                },
                {
                    id: 2,
                    name: "One Piece Figure - Monkey D. Luffy",
                    price: 850000,
                    quantity: 2,
                    image: "",
                    available: 8,
                },
                {
                    id: 3,
                    name: "Attack on Titan - Eren Jaeger Action Figure",
                    price: 750000,
                    quantity: 1,
                    image: "",
                    available: 3,
                },
            ];
            setCartItems(sampleCartItems);
            setLoading(false);
        };

        fetchCartItems();
    }, []);

    // Tính tổng tiền
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    // Tính phí vận chuyển (miễn phí nếu trên 1.500.000đ)
    const shipping = subtotal > 1500000 ? 0 : 30000;

    // Tổng số tiền cần thanh toán
    const total = subtotal + shipping - discount;

    // Hàm xử lý thay đổi số lượng
    const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        const item = cartItems.find((item) => item.id === id);
        if (item && newQuantity > item.available) {
            toast.error("Số lượng không đủ", {
                description: `Chỉ còn ${item.available} sản phẩm trong kho.`,
                action: {
                    label: "Cancel",
                    onClick: () => console.log("Clicked"),
                },
            });
            return;
        }

        setCartItems(
            cartItems.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item,
            ),
        );
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const removeItem = (id: number) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
        toast.success("Đã xóa sản phẩm", {
            description: "Sản phẩm đã được xóa khỏi giỏ hàng.",
        });
    };

    // Hàm áp dụng mã giảm giá
    const applyCoupon = () => {
        if (!couponCode) return;

        // Giả lập kiểm tra mã giảm giá
        if (couponCode.toUpperCase() === "WELCOME10") {
            // Giảm 10% tổng hóa đơn
            const discountAmount = Math.floor(subtotal * 0.1);
            setDiscount(discountAmount);
            setAppliedCoupon(couponCode.toUpperCase());
            toast.success("Áp dụng mã giảm giá thành công", {
                description: `Bạn được giảm ${discountAmount.toLocaleString(
                    "vi-VN",
                )}₫`,
            });
        } else if (couponCode.toUpperCase() === "FREESHIP") {
            // Miễn phí vận chuyển
            setDiscount(shipping);
            setAppliedCoupon(couponCode.toUpperCase());
            toast("Áp dụng mã giảm giá thành công", {
                description: "Bạn được miễn phí vận chuyển",
            });
        } else {
            toast.error("Mã giảm giá không hợp lệ", {
                description: "Vui lòng kiểm tra lại mã giảm giá.",
            });
        }

        setCouponCode("");
    };

    // Hàm xử lý thanh toán
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.warning("Giỏ hàng trống", {
                description:
                    "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.",
            });
            return;
        }

        // Chuyển hướng đến trang thanh toán
        router.push("/checkout");
    };

    // Hiển thị trạng thái đang tải
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                    <p className="text-lg">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                    <ShoppingBagIcon className="h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">
                        Giỏ hàng trống
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Bạn chưa có sản phẩm nào trong giỏ hàng.
                    </p>
                    <Link href="/products">
                        <Button>Tiếp tục mua sắm</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">
                                                Sản phẩm
                                            </TableHead>
                                            <TableHead>Tên</TableHead>
                                            <TableHead className="text-right">
                                                Đơn giá
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Số lượng
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Thành tiền
                                            </TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cartItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="relative h-20 w-20 bg-gray-100 rounded-md">
                                                        {item.image ? (
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover rounded-md"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    e.currentTarget.src =
                                                                        "/placeholder.png";
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                                <p className="text-gray-400">
                                                                    Không có
                                                                    hình ảnh
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <Link
                                                        href={`/products/${item.id}`}
                                                        className="hover:text-blue-600 transition-colors"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {item.price.toLocaleString(
                                                        "vi-VN",
                                                    )}
                                                    ₫
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity -
                                                                        1,
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity <=
                                                                1
                                                            }
                                                        >
                                                            <MinusIcon className="h-3 w-3" />
                                                        </Button>
                                                        <Input
                                                            type="number"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(e) =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                    ) || 1,
                                                                )
                                                            }
                                                            className="h-8 w-12 mx-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                            min={1}
                                                            max={item.available}
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity +
                                                                        1,
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity >=
                                                                item.available
                                                            }
                                                        >
                                                            <PlusIcon className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toLocaleString("vi-VN")}
                                                    ₫
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            removeItem(item.id)
                                                        }
                                                    >
                                                        <TrashIcon className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <div className="flex justify-between mt-6">
                            <Link href="/products">
                                <Button variant="outline">
                                    Tiếp tục mua sắm
                                </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                onClick={() => setCartItems([])}
                            >
                                Xóa giỏ hàng
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4">
                                    Tóm tắt đơn hàng
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Tạm tính (
                                            {cartItems.reduce(
                                                (sum, item) =>
                                                    sum + item.quantity,
                                                0,
                                            )}{" "}
                                            sản phẩm)
                                        </span>
                                        <span>
                                            {subtotal.toLocaleString("vi-VN")}₫
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Phí vận chuyển
                                        </span>
                                        <span>
                                            {shipping === 0
                                                ? "Miễn phí"
                                                : `${shipping.toLocaleString(
                                                      "vi-VN",
                                                  )}₫`}
                                        </span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>
                                                Giảm giá{" "}
                                                {appliedCoupon &&
                                                    `(${appliedCoupon})`}
                                            </span>
                                            <span>
                                                -
                                                {discount.toLocaleString(
                                                    "vi-VN",
                                                )}
                                                ₫
                                            </span>
                                        </div>
                                    )}

                                    <Separator />

                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Tổng cộng</span>
                                        <span>
                                            {total.toLocaleString("vi-VN")}₫
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Nhập mã giảm giá"
                                            value={couponCode}
                                            onChange={(e) =>
                                                setCouponCode(e.target.value)
                                            }
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={applyCoupon}
                                        >
                                            Áp dụng
                                        </Button>
                                    </div>

                                    {shipping > 0 && (
                                        <p className="text-sm text-gray-500">
                                            Miễn phí vận chuyển cho đơn hàng
                                            trên 1.500.000₫
                                        </p>
                                    )}

                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={handleCheckout}
                                    >
                                        Tiến hành thanh toán
                                    </Button>

                                    <div className="text-sm text-gray-500">
                                        <p>Cam kết:</p>
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                            <li>Giao hàng toàn quốc</li>
                                            <li>Đổi trả trong vòng 7 ngày</li>
                                            <li>
                                                Bảo hành chính hãng 12 tháng
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
