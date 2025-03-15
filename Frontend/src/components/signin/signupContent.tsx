"use client";
import { getDistrict, getProvince, getWard } from "@/actions/address";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { handleSignup } from "@/actions/signup";

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "../ui/drawer";
import { useRouter } from "next/navigation";

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
            .positive("Tỉnh/thành phố không được để trống"),
        districtId: z.number().int().positive("Quận/huyện không được để trống"),
        wardId: z.number().int().positive("Phường/xã không được để trống"),
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
        .optional() // Thay vì nonempty
        .default([]), // Cho phép mảng rỗng
});
type SignupFormValues = z.infer<typeof signupSchema>;

const SignUpContent = () => {
    const route = useRouter();
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState(false);
    const [provincesList, setProvincesList] = useState<Province[]>([]);
    const [districtsList, setDistrictsList] = useState<District[]>([]);
    const [wardsList, setWardsList] = useState<Ward[]>([]);
    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            password: "",
            fullname: "",
            email: "",
            phone: "",
            gender: "0", // Mặc định là "Không xác định"
            address: {
                line: "",
                provinceId: 0,
                districtId: 0,
                wardId: 0,
            },
            avatar: "", // URL rỗng có thể gây lỗi validation
            status: 1, // Mặc định là kích hoạt
            roles: [], // Sẽ được xử lý trong schema
        },
        mode: "onChange", // Thêm mode để validation khi thay đổi
    });
    const provinceId = form.watch("address.provinceId");
    const districtId = form.watch("address.districtId");

    useEffect(() => {
        (async () => {
            try {
                const provinces = await getProvince({
                    page: 0,
                    size: 63,
                    sort: "name",
                    filter: "",
                    search: "",
                    all: true,
                });
                setProvincesList(provinces);
            } catch (error) {
                console.error("Error fetching provinces:", error);
                // Có thể hiển thị thông báo lỗi cho người dùng
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const districts = await getDistrict({
                    page: 1,
                    size: 40,
                    sort: "name",
                    filter: `province.id==${provinceId}`,
                    search: ``,
                    all: false,
                });
                setDistrictsList(districts);
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        })();
        setWardsList([]);
    }, [provinceId]);

    useEffect(() => {
        (async () => {
            try {
                const wards = await getWard({
                    page: 1,
                    size: 40,
                    sort: "name",
                    filter: `district.id==${districtId || 0}`,
                    search: ``,
                    all: false,
                });

                setWardsList(wards);
            } catch (error) {
                console.error("Error fetching wards:", error);
            }
        })();
    }, [districtId]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        const signupData: SignupFormValues = {
            ...data,
            roles: [
                {
                    id: 1,
                    code: "ADMIN",
                    name: "Quản trị viên",
                    status: 1,
                },
            ], // Sửa lỗi chính tả
        };

        console.log("Dữ liệu gửi đi:", {
            ...signupData,
            avatar: signupData.avatar || "",
            gender: 0,
            status: 1,
        });

        try {
            const res = await handleSignup({
                ...signupData,
                avatar: signupData.avatar || "none",
            })();
            console.log("Đăng ký thành công:", res);
            setId(res.data.userId);
            if (res.status === 200) {
                route.push(`/signup/${res.data.userId}`);
            }
        } catch (error) {
            console.error("Error signing up:", error);
        }

        setLoading(false);
    };

    return (
        <CardContent className="flex p-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6"
                >
                    {/* Username */}
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

                    {/* Fullname */}
                    <FormField
                        control={form.control}
                        name="fullname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên đầy đủ</FormLabel>
                                <FormControl>
                                    <Input
                                        type="fullname"
                                        placeholder="Nhập tên đầy đủ"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-row gap-3">
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="basis-1/2">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Nhập email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="basis-1/2">
                                    <FormLabel>Số điện thoại</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="Nhập số điện thoại"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Address */}
                    <FormField
                        control={form.control}
                        name="address.line"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Địa chỉ</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập địa chỉ"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-row gap-3">
                        {/* Province */}
                        <FormField
                            control={form.control}
                            name="address.provinceId"
                            render={({ field }) => (
                                <FormItem className="basis-1/3">
                                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(Number(value) || 0); // Sửa lại để xử lý trường hợp value không phải số
                                        }}
                                        value={
                                            field.value
                                                ? field.value.toString()
                                                : "0"
                                        } // Sửa lại value
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn tỉnh/thành phố" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {provincesList.map(
                                                (province: any) => (
                                                    <SelectItem
                                                        key={province.id}
                                                        value={province.id.toString()}
                                                    >
                                                        {province.name}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* District ID */}
                        <FormField
                            control={form.control}
                            name="address.districtId"
                            render={({ field }) => (
                                <FormItem className="basis-1/3">
                                    <FormLabel>Quận/Huyện</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(Number(value) || 0); // Sửa lại để xử lý trường hợp value không phải số
                                        }}
                                        value={
                                            field.value
                                                ? field.value.toString()
                                                : "0"
                                        } // Sửa lại value
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn Quận/Huyện" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {districtsList.map(
                                                (distric: any) => (
                                                    <SelectItem
                                                        key={distric.id}
                                                        value={distric.id.toString()}
                                                    >
                                                        {distric.name}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Ward ID */}
                        <FormField
                            control={form.control}
                            name="address.wardId"
                            render={({ field }) => (
                                <FormItem className="basis-1/3">
                                    <FormLabel>Phường/Xã</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(Number(value) || 0); // Sửa lại để xử lý trường hợp value không phải số
                                        }}
                                        value={
                                            field.value
                                                ? field.value.toString()
                                                : "0"
                                        } // Sửa lại value
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn phường/xã" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {wardsList.map((ward: any) => (
                                                <SelectItem
                                                    key={ward.id}
                                                    value={ward.id.toString()}
                                                >
                                                    {ward.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Avatar */}
                    <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Avatar</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập URL avatar"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
            </Form>
        </CardContent>
    );
};

export default SignUpContent;
