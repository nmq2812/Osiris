import { categories } from "@/app/mockData";
import { Card } from "../ui/card";
import Image from "next/image";

export default function FeaturedCategoriesSection() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
                Danh mục nổi bật
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                    <Card
                        key={index}
                        className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <div className="relative h-48">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                                <h3 className="text-white text-xl font-bold">
                                    {category.name}
                                </h3>
                                <span className="text-gray-200 text-sm">
                                    {category.count} sản phẩm
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
}
