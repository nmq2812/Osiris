"use client";
import { Button } from "../ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "../ui/drawer";
import { z } from "zod";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface VerifyDrawerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

interface VerifyFormValues {
    code: string;
}

const verifyFormSchema = z.object({
    code: z.string().nonempty("Mã xác thực không được để trống"),
});

const VerifyDrawer = ({ open, setOpen }: VerifyDrawerProps) => {
    const form = useForm<VerifyFormValues>({
        resolver: zodResolver(verifyFormSchema),
        defaultValues: {
            token: "",
        },
        mode: "onChange", // Thêm mode để validation khi thay đổi
    });

    const onSubmit = async (values: VerifyFormValues) => {
        try {
            await handleVerifyEmail(values.token)();
            toast.success("Xác thực email thành công");
            setOpen(false);
        } catch (error) {
            toast.error(error.message);
        }
    };
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="p-4">
                <DrawerHeader>
                    <DrawerTitle>Xác thực Email</DrawerTitle>
                    <DrawerDescription>
                        {`Mã xác thực đã được gửi đến email của bạn! 
                        Vui lòng kiểm tra email và nhập mã xác thực.`}
                    </DrawerDescription>
                </DrawerHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6"
                    >
                        <Input
                            label="Mã xác thực"
                            placeholder="Nhập mã xác thực"
                            type="text"
                            className="mt-2"
                        />
                        <Button type="submit" className="mt-2">
                            Xác thực
                        </Button>
                    </form>
                </Form>
            </DrawerContent>
        </Drawer>
    );
};

export default VerifyDrawer;
