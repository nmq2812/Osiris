"use server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="text-center py-6">
                <h1 className="text-4xl font-bold text-blue-600">OSIRIS</h1>
                <p className="text-lg text-gray-700 mt-2">
                    Chào mừng bạn đến với cửa hàng mô hình của chúng tôi!
                </p>
            </header>
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Example Product Card */}
                <Card className="shadow-lg">
                    <CardHeader className="p-0">
                        <img
                            src="/path/to/figure-image.jpg"
                            alt="Figure"
                            className="w-full h-48 object-cover"
                        />
                    </CardHeader>
                    <CardContent className="p-4">
                        <CardTitle className="text-xl font-semibold">
                            Figure 1
                        </CardTitle>
                        <p className="text-gray-700 mt-2">
                            Mô tả ngắn về sản phẩm Figure 1.
                        </p>
                        <Button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white">
                            Mua ngay
                        </Button>
                    </CardContent>
                </Card>
                {/* Add more product cards as needed */}
            </main>
        </div>
    );
};

export default HomePage;
