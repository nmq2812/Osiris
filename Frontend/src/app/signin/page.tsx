"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { use, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUpContent from "./signupContent";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { handleLogin } from "@/actions/login";
import { useAuthStore } from "@/stores/authStore";

// Schema kiểm tra dữ liệu nhập vào
const loginSchema = z.object({
    username: z.string(),
    password: z
        .string()
        .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});
type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Tabs defaultValue="signin" className="w-2/4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">
                        <a className="text-gray-500">Đăng nhập</a>
                    </TabsTrigger>
                    <TabsTrigger value="signup">
                        <a className="text-gray-500">Đăng ký</a>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <LoginPageContent></LoginPageContent>
                </TabsContent>
                <TabsContent value="signup">
                    <SignUpContent></SignUpContent>
                </TabsContent>
            </Tabs>
        </div>
    );
};

const LoginPageContent = () => {
    const [loading, setLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        const res = await handleLogin({
            username: data.username,
            password: data.password,
        })();
        console.log(useAuthStore.getState().token);
        setTimeout(() => setLoading(false), 2000); // Fake API call
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center text-2xl">
                    Đăng Nhập
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên đăng nhập</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên đăng nhập"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Nhập mật khẩu"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            ) : (
                                "Đăng nhập"
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center">
                    <Link
                        href="/signup"
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Chưa có tài khoản? Đăng ký
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default LoginPage;
