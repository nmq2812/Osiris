"use client";
import React from "react";
import { Carousel as AntCarousel } from "antd";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { CarouselRef } from "antd/es/carousel";

function ClientCarousel({ children }: { children: React.ReactElement[] }) {
    const carouselRef = React.useRef<CarouselRef>(null);

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 10000,
        pauseOnHover: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const prevSlide = () => {
        if (carouselRef.current) {
            carouselRef.current.prev();
        }
    };

    const nextSlide = () => {
        if (carouselRef.current) {
            carouselRef.current.next();
        }
    };

    return (
        <div className="relative rounded-lg overflow-hidden">
            <div className="relative">
                <AntCarousel ref={carouselRef} {...settings}>
                    {children}
                </AntCarousel>

                <div className="absolute z-10 top-1/2 left-4 -translate-y-1/2 flex items-center justify-center rounded-md bg-white/75 hover:bg-white hover:opacity-100 opacity-75 transition-opacity shadow-md">
                    <Button
                        type="default"
                        shape="circle"
                        icon={<LeftOutlined />}
                        onClick={prevSlide}
                        size="large"
                    />
                </div>

                <div className="absolute z-10 top-1/2 right-4 -translate-y-1/2 flex items-center justify-center rounded-md bg-white/75 hover:bg-white hover:opacity-100 opacity-75 transition-opacity shadow-md">
                    <Button
                        type="default"
                        shape="circle"
                        icon={<RightOutlined />}
                        onClick={nextSlide}
                        size="large"
                    />
                </div>
            </div>
        </div>
    );
}

export default ClientCarousel;
