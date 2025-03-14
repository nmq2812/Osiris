import SignupContent from "@/components/signin/signupContent";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const SignupPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-center">Đăng ký</CardTitle>
                </CardHeader>
                <SignupContent></SignupContent>
            </Card>
        </div>
    );
};
export default SignupPage;
