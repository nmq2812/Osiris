import { Table, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import {
    TableCaption,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../ui/table";
import { Badge } from "@/components/ui/badge";

export default function InfoTableSection() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
            <h2 className="text-3xl font-bold mb-8 text-center">
                Bảng giá sản phẩm mới nhất
            </h2>
            <Table>
                <TableCaption>Cập nhật ngày 07/03/2025</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Mã sản phẩm</TableHead>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead>Danh mục</TableHead>
                        <TableHead className="text-right">Giá</TableHead>
                        <TableHead className="text-center">
                            Tình trạng
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">GN001</TableCell>
                        <TableCell>Gundam RX-78-2 Ver.Ka</TableCell>
                        <TableCell>Gundam</TableCell>
                        <TableCell className="text-right">1,200,000₫</TableCell>
                        <TableCell className="text-center">
                            <Badge
                                variant="outline"
                                className="bg-green-50 text-green-600 border-green-200"
                            >
                                Còn hàng
                            </Badge>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">AN002</TableCell>
                        <TableCell>Nezuko Kamado Figure</TableCell>
                        <TableCell>Anime</TableCell>
                        <TableCell className="text-right">850,000₫</TableCell>
                        <TableCell className="text-center">
                            <Badge
                                variant="outline"
                                className="bg-red-50 text-red-600 border-red-200"
                            >
                                Hết hàng
                            </Badge>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">ME003</TableCell>
                        <TableCell>Evangelion Unit 01</TableCell>
                        <TableCell>Mecha</TableCell>
                        <TableCell className="text-right">1,500,000₫</TableCell>
                        <TableCell className="text-center">
                            <Badge
                                variant="outline"
                                className="bg-yellow-50 text-yellow-600 border-yellow-200"
                            >
                                Sắp về hàng
                            </Badge>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">AN004</TableCell>
                        <TableCell>Jujutsu Kaisen - Gojo Satoru</TableCell>
                        <TableCell>Anime</TableCell>
                        <TableCell className="text-right">990,000₫</TableCell>
                        <TableCell className="text-center">
                            <Badge
                                variant="outline"
                                className="bg-green-50 text-green-600 border-green-200"
                            >
                                Còn hàng
                            </Badge>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">GN005</TableCell>
                        <TableCell>Gundam Barbatos Lupus Rex</TableCell>
                        <TableCell>Gundam</TableCell>
                        <TableCell className="text-right">1,350,000₫</TableCell>
                        <TableCell className="text-center">
                            <Badge
                                variant="outline"
                                className="bg-green-50 text-green-600 border-green-200"
                            >
                                Còn hàng
                            </Badge>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Alert variant="destructive" className="mt-8">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Lưu ý!</AlertTitle>
                <AlertDescription>
                    Giá có thể thay đổi theo thời gian. Vui lòng liên hệ nhân
                    viên để có thông tin chính xác nhất.
                </AlertDescription>
            </Alert>
        </section>
    );
}
