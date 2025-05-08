import ManagerPath from "@/constants/ManagerPath";
import ResourceURL from "@/constants/ResourceURL";
import { Configs } from "@/datas/Configs";
import {
    EntityPropertyType,
    EntityPropertySchema,
} from "@/datas/EntityProperty";
import { TitleLink } from "@/datas/TitleLink";
import MessageUtils from "@/utils/MessageUtils";
import PageConfigs from "@/utils/PageConfigs";
import { z } from "zod";
import OrderResourceConfigs from "../resource/OrderResourceConfigs";

class OrderCancellationReasonConfigs extends Configs {
    static managerPath = ManagerPath.ORDER_CANCELLATION_REASON;
    static resourceUrl = ResourceURL.ORDER_CANCELLATION_REASON;
    static resourceKey = "order-cancellation-reasons";
    static createTitle = "Thêm lý do hủy đơn hàng";
    static updateTitle = "Cập nhật lý do hủy đơn hàng";
    static manageTitle = "Quản lý lý do hủy đơn hàng";

    static manageTitleLinks: TitleLink[] =
        OrderResourceConfigs.manageTitleLinks;

    protected static _rawProperties = {
        ...PageConfigs.getProperties(true, true, true),
        name: {
            label: "Tên lý do hủy đơn hàng",
            type: EntityPropertyType.STRING,
            isShowInTable: true,
        },
        note: {
            label: "Ghi chú lý do hủy đơn hàng",
            type: EntityPropertyType.STRING,
        },
        status: {
            label: "Trạng thái lý do hủy đơn hàng",
            type: EntityPropertyType.NUMBER,
            isShowInTable: true,
        },
    };

    static properties =
        OrderCancellationReasonConfigs._rawProperties as EntityPropertySchema<
            typeof OrderCancellationReasonConfigs._rawProperties &
                typeof PageConfigs.properties
        >;

    static initialCreateUpdateFormValues = {
        name: "",
        note: "",
        status: "1",
    };

    static createUpdateFormSchema = z.object({
        name: z
            .string()
            .min(
                2,
                MessageUtils.min(
                    OrderCancellationReasonConfigs.properties.name.label,
                    2,
                ),
            ),
        note: z.string(),
        status: z.string(),
    });
}

export default OrderCancellationReasonConfigs;
