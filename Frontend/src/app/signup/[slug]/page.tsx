"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { handleVerifyEmail } from "@/actions/signup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const VerifyEmail = () => {
    // Lấy token từ URL
    const params = useParams();
    const tokenFromUrl = params.slug?.toString() || "";

    const router = useRouter();
    const [verificationCode, setVerificationCode] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<
        "idle" | "success" | "error"
    >("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setVerificationStatus("idle");
        setErrorMessage("");

        try {
            // Gọi API xác thực email
            const result = await handleVerifyEmail(
                Number(tokenFromUrl),
                verificationCode || "",
            )();

            console.log(result);
            setVerificationStatus("success");

            // Chuyển hướng sau 3 giây
            setTimeout(() => {
                router.push("/signin");
            }, 3000);
        } catch (error) {
            setVerificationStatus("error");
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Đã xảy ra lỗi khi xác thực email",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Xác thực Email
                    </CardTitle>
                    <CardDescription className="text-center">
                        Vui lòng nhập mã xác thực được gửi đến email của bạn
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {verificationStatus === "idle" && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    id="verificationCode"
                                    placeholder="Nhập mã xác thực"
                                    value={verificationCode}
                                    onChange={(e) =>
                                        setVerificationCode(e.target.value)
                                    }
                                    className="w-full"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || !verificationCode}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang xác thực...
                                    </>
                                ) : (
                                    "Xác thực Email"
                                )}
                            </Button>
                        </form>
                    )}

                    {verificationStatus === "success" && (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <CheckCircle className="h-16 w-16 text-green-500" />
                            </div>
                            <p className="text-lg font-medium">
                                Xác thực email thành công!
                            </p>
                            <p className="text-gray-500">
                                Tài khoản của bạn đã được kích hoạt. Bạn sẽ được
                                chuyển hướng đến trang đăng nhập trong vài
                                giây...
                            </p>
                        </div>
                    )}

                    {verificationStatus === "error" && (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <XCircle className="h-16 w-16 text-red-500" />
                            </div>
                            <p className="text-lg font-medium">
                                Xác thực không thành công
                            </p>
                            <p className="text-red-500">{errorMessage}</p>
                            <Button
                                onClick={() => setVerificationStatus("idle")}
                                variant="outline"
                            >
                                Thử lại
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        Không nhận được mã?{" "}
                        <Button variant="link" className="p-0 h-auto text-sm">
                            Gửi lại mã
                        </Button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default VerifyEmail;
