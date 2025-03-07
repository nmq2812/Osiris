import { Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

export default function SalesAlertSection() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">
                    Ưu đãi đặc biệt!
                </AlertTitle>
                <AlertDescription className="text-blue-700">
                    Giảm ngay 15% cho đơn hàng đầu tiên khi nhập mã{" "}
                    <strong>WELCOME15</strong>
                </AlertDescription>
            </Alert>
        </section>
    );
}
