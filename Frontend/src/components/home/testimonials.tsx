import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "../ui/carousel";

export default function TestimonialsSection() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold mb-12 text-center">
                Khách hàng nói gì về chúng tôi
            </h2>

            <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                    {[
                        {
                            name: "Nguyễn Văn A",
                            avatar: "/images/avatar1.jpg",
                            role: "Khách hàng VIP",
                            content:
                                "Tôi rất hài lòng về chất lượng mô hình tại OSIRIS. Đóng gói cẩn thận, sản phẩm chính hãng và dịch vụ khách hàng tuyệt vời.",
                            rating: 5,
                        },
                        {
                            name: "Trần Thị B",
                            avatar: "/images/avatar2.jpg",
                            role: "Người sưu tầm",
                            content:
                                "Shop có nhiều mẫu mã đa dạng, giá cả hợp lý. Tôi đã mua nhiều mô hình Gundam tại đây và rất hài lòng về chất lượng.",
                            rating: 5,
                        },
                        {
                            name: "Lê Văn C",
                            avatar: "/images/avatar3.jpg",
                            role: "Khách hàng thường xuyên",
                            content:
                                "OSIRIS là địa chỉ tin cậy để mua mô hình anime chính hãng. Nhân viên tư vấn nhiệt tình, giao hàng nhanh chóng.",
                            rating: 4,
                        },
                    ].map((testimonial, index) => (
                        <CarouselItem
                            key={index}
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            <Card className="h-full">
                                <CardContent className="pt-6">
                                    <div className="flex items-center mb-4">
                                        <Avatar className="h-10 w-10 mr-4">
                                            <AvatarImage
                                                src={testimonial.avatar}
                                            />
                                            <AvatarFallback>
                                                {testimonial.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">
                                                {testimonial.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${
                                                    i < testimonial.rating
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 italic">
                                        "{testimonial.content}"
                                    </p>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="flex justify-center mt-6">
                    <CarouselPrevious
                        variant="outline"
                        className="relative inset-0 translate-x-0 translate-y-0 mr-2"
                    />
                    <CarouselNext
                        variant="outline"
                        className="relative inset-0 translate-x-0 translate-y-0"
                    />
                </div>
            </Carousel>
        </section>
    );
}
