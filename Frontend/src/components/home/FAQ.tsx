import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@radix-ui/react-accordion";

export default function FAQSection() {
    return (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold mb-12 text-center">
                Câu hỏi thường gặp
            </h2>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">
                        Quy trình đặt hàng tại OSIRIS như thế nào?
                    </AccordionTrigger>
                    <AccordionContent>
                        Để đặt hàng tại OSIRIS, bạn chỉ cần chọn sản phẩm muốn
                        mua, thêm vào giỏ hàng, điền thông tin giao hàng và
                        thanh toán. Chúng tôi sẽ xử lý đơn hàng và giao tới bạn
                        trong thời gian sớm nhất.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">
                        Thời gian giao hàng mất bao lâu?
                    </AccordionTrigger>
                    <AccordionContent>
                        Thời gian giao hàng thông thường từ 2-5 ngày làm việc
                        đối với các đơn hàng trong nội thành, và 5-10 ngày làm
                        việc đối với các đơn hàng ở tỉnh thành khác tùy thuộc
                        vào địa điểm.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">
                        Chính sách đổi trả sản phẩm ra sao?
                    </AccordionTrigger>
                    <AccordionContent>
                        OSIRIS chấp nhận đổi trả sản phẩm trong vòng 7 ngày kể
                        từ ngày nhận hàng nếu sản phẩm có lỗi từ nhà sản xuất.
                        Sản phẩm đổi trả phải còn nguyên vẹn, không có dấu hiệu
                        đã qua sử dụng và còn đầy đủ bao bì, phụ kiện.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left">
                        Các phương thức thanh toán được chấp nhận?
                    </AccordionTrigger>
                    <AccordionContent>
                        OSIRIS chấp nhận nhiều phương thức thanh toán khác nhau
                        bao gồm: thanh toán khi nhận hàng (COD), chuyển khoản
                        ngân hàng, thanh toán qua VNPay, Momo, ZaloPay và thẻ
                        tín dụng/ghi nợ quốc tế.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left">
                        Làm thế nào để biết sản phẩm là chính hãng?
                    </AccordionTrigger>
                    <AccordionContent>
                        Tất cả sản phẩm tại OSIRIS đều là hàng chính hãng, có
                        tem nhãn đầy đủ và được nhập khẩu trực tiếp từ Nhật Bản
                        hoặc từ các nhà phân phối chính thức. Chúng tôi cam kết
                        100% về chất lượng và xuất xứ sản phẩm.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>
    );
}
