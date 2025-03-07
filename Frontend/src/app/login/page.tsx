"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// Schema kiểm tra dữ liệu nhập vào
const loginSchema = z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z
        .string()
        .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

const LoginPage = () => {
    const [loading, setLoading] = useState(false);

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        console.log("Dữ liệu gửi đi:", data);
        setTimeout(() => setLoading(false), 2000); // Fake API call
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="">
                    <CardTitle className="text-center text-2xl">
                        Đăng Nhập
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Email */}
                        <div className="space-y-1">
                            <Label>Email</Label>
                            <Input
                                {...register("email")}
                                placeholder="Nhập email"
                                type="email"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">
                                    {errors.email.message as string}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <Label>Mật khẩu</Label>
                            <Input
                                {...register("password")}
                                placeholder="Nhập mật khẩu"
                                type="password"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm">
                                    {errors.password.message as string}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                            disabled={loading}
                            style={{
                                cursor: loading ? "not-allowed" : "pointer",
                            }}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Đăng nhập"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
