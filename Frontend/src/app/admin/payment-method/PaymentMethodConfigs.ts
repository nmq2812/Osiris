import ManagerPath from "@/constants/ManagerPath";
import ResourceURL from "@/constants/ResourceURL";
import { Configs } from "@/datas/Configs";
import { TitleLink } from "@/datas/TitleLink";

class PaymentMethodConfigs extends Configs {
    static resourceUrl = ResourceURL.PAYMENT_METHOD;
    static resourceKey = "payment-methods";
    static manageTitle = "Quản lý hình thức thanh toán";
    static manageTitleLinks: TitleLink[] = [
        {
            link: ManagerPath.VOUCHER,
            label: "Quản lý sổ quỹ",
        },
        {
            link: ManagerPath.PAYMENT_METHOD,
            label: "Quản lý hình thức thanh toán",
        },
        {
            link: ManagerPath.PROMOTION,
            label: "Quản lý khuyến mãi",
        },
    ];
}

export default PaymentMethodConfigs;
