import { Label } from "@radix-ui/react-label";
import { Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function NewsletterSection() {
    return (
        <section className="bg-blue-900 py-16 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:w-1/2">
                    <h2 className="text-3xl font-bold mb-4">
                        Đăng ký nhận thông tin
                    </h2>
                    <p className="text-blue-200">
                        Nhận thông báo về sản phẩm mới và ưu đãi đặc biệt dành
                        cho bạn
                    </p>
                </div>
                <div className="md:w-1/2">
                    <form className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-grow">
                            <Label htmlFor="email" className="sr-only">
                                Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="Email của bạn"
                                type="email"
                                className="w-full bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                            />
                        </div>
                        <Button className="bg-white text-blue-900 hover:bg-blue-100">
                            <Mail className="h-4 w-4 mr-2" />
                            Đăng ký
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
