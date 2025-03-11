"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signupSchema = z.object({
    username: z.string().min(3, "Username phải có ít nhất 3 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    fullname: z.string().min(1, "Họ và tên không được để trống"),
    email: z.string().email("Email không hợp lệ"),
    phone: z
        .string()
        .regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0"),
    gender: z.enum(["0", "1", "2"], {
        errorMap: () => ({ message: "Giới tính không hợp lệ" }),
    }), // 0: Không xác định, 1: Nam, 2: Nữ
    address: z.object({
        line: z.string().min(1, "Địa chỉ không được để trống"),
        provinceId: z
            .number()
            .int()
            .positive("ID tỉnh/thành phố phải là số dương"),
        districtId: z.number().int().positive("ID quận/huyện phải là số dương"),
        wardId: z.number().int().positive("ID phường/xã phải là số dương"),
    }),
    avatar: z.string().url("Avatar phải là một URL hợp lệ").optional(),
    status: z.number().int().min(0).max(1, "Trạng thái không hợp lệ"), // 0: Vô hiệu hóa, 1: Kích hoạt
    roles: z
        .array(
            z.object({
                id: z.number().int().positive("ID vai trò phải là số dương"),
                code: z.string().min(1, "Mã vai trò không được để trống"),
                name: z.string().min(1, "Tên vai trò không được để trống"),
                status: z
                    .number()
                    .int()
                    .min(0)
                    .max(1, "Trạng thái không hợp lệ"),
            }),
        )
        .nonempty("Phải có ít nhất một vai trò"),
});

const SignUpContent = () => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        console.log("Dữ liệu gửi đi:", data);
        setTimeout(() => setLoading(false), 2000); // Fake API call
    };
    return (
        <Card>
            <CardHeader className="">
                <CardTitle className="text-center text-2xl">Đăng Ký</CardTitle>
            </CardHeader>
            <CardContent className="flex p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Username */}
                    <div className="space-y-1">
                        <Label>Username</Label>
                        <Input
                            {...register("username")}
                            placeholder="Nhập username"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm">
                                {errors.username.message as string}
                            </p>
                        )}
                    </div>

                    {/* Fullname */}
                    <div className="space-y-1">
                        <Label>Họ và tên</Label>
                        <Input
                            {...register("fullname")}
                            placeholder="Nhập họ và tên"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.fullname && (
                            <p className="text-red-500 text-sm">
                                {errors.fullname.message as string}
                            </p>
                        )}
                    </div>

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

                    {/* Phone */}
                    <div className="space-y-1">
                        <Label>Số điện thoại</Label>
                        <Input
                            {...register("phone")}
                            placeholder="Nhập số điện thoại"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">
                                {errors.phone.message as string}
                            </p>
                        )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-1">
                        <Label>Giới tính</Label>
                        <select
                            {...register("gender")}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="0">Không xác định</option>
                            <option value="1">Nam</option>
                            <option value="2">Nữ</option>
                        </select>
                        {errors.gender && (
                            <p className="text-red-500 text-sm">
                                {errors.gender.message as string}
                            </p>
                        )}
                    </div>

                    {/* Address */}
                    <div className="space-y-1">
                        <Label>Địa chỉ</Label>
                        <Input
                            {...register("address.line")}
                            placeholder="Nhập địa chỉ"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.address?.line && (
                            <p className="text-red-500 text-sm">
                                {errors.address.line.message as string}
                            </p>
                        )}
                    </div>

                    {/* Province ID */}
                    <div className="space-y-1">
                        <Label>ID tỉnh/thành phố</Label>
                        <Input
                            {...register("address.provinceId")}
                            placeholder="Nhập ID tỉnh/thành phố"
                            type="number"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.address?.provinceId && (
                            <p className="text-red-500 text-sm">
                                {errors.address.provinceId.message as string}
                            </p>
                        )}
                    </div>

                    {/* District ID */}
                    <div className="space-y-1">
                        <Label>ID quận/huyện</Label>
                        <Input
                            {...register("address.districtId")}
                            placeholder="Nhập ID quận/huyện"
                            type="number"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.address?.districtId && (
                            <p className="text-red-500 text-sm">
                                {errors.address.districtId.message as string}
                            </p>
                        )}
                    </div>

                    {/* Ward ID */}
                    <div className="space-y-1">
                        <Label>ID phường/xã</Label>
                        <Input
                            {...register("address.wardId")}
                            placeholder="Nhập ID phường/xã"
                            type="number"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.address?.wardId && (
                            <p className="text-red-500 text-sm">
                                {errors.address.wardId.message as string}
                            </p>
                        )}
                    </div>

                    {/* Avatar */}
                    <div className="space-y-1">
                        <Label>Avatar</Label>
                        <Input
                            {...register("avatar")}
                            placeholder="Nhập URL avatar"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.avatar && (
                            <p className="text-red-500 text-sm">
                                {errors.avatar.message as string}
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="space-y-1">
                        <Label>Trạng thái</Label>
                        <select
                            {...register("status")}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="0">Vô hiệu hóa</option>
                            <option value="1">Kích hoạt</option>
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-sm">
                                {errors.status.message as string}
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
                            "Đăng ký"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default SignUpContent;
