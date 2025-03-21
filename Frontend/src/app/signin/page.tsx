"use server";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import LoginPageContent from "../../components/signin/signinContent";

const LoginPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-center">Đăng nhập</CardTitle>
                </CardHeader>
                <LoginPageContent></LoginPageContent>
            </Card>
        </div>
    );
};

export default LoginPage;
