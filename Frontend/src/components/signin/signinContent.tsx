"use client";
import { handleSignin } from "@/actions/signin";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Link } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema kiểm tra dữ liệu nhập vào
const loginSchema = z.object({
    username: z.string(),
    password: z
        .string()
        .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});
type LoginFormValues = z.infer<typeof loginSchema>;

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
        const res = await handleSignin({
            username: data.username,
            password: data.password,
        })();
        console.log(useAuthStore.getState().token);
        setTimeout(() => setLoading(false), 2000); // Fake API call
    };

    return (
        <CardContent className="p-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6"
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
    );
};

export default LoginPageContent;
