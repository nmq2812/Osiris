import { carouselData } from "@/app/mockData";
import { Button } from "../ui/button";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "../ui/carousel";

export default function HeroCarouselSection() {
    return (
        <section className="relative mb-12">
            <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                    {carouselData.map((slide, index) => (
                        <CarouselItem key={index}>
                            <div className="relative h-[500px] overflow-hidden">
                                <div
                                    className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-70 z-10`}
                                ></div>
                                <Image
                                    src={slide.img}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-6 text-center">
                                    <h1 className="text-5xl font-bold mb-4 max-w-3xl">
                                        {slide.title}
                                    </h1>
                                    <p className="text-xl mb-8 max-w-2xl">
                                        {slide.desc}
                                    </p>
                                    <Button
                                        size="lg"
                                        className="bg-white text-blue-900 hover:bg-gray-100"
                                    >
                                        Khám phá ngay
                                    </Button>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        </section>
    );
}
