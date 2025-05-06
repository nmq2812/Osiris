import ManagerPath from "@/constants/ManagerPath";
import ResourceURL from "@/constants/ResourceURL";
import { Configs } from "@/datas/Configs";
import {
    EntityPropertyType,
    EntityPropertySchema,
} from "@/datas/EntityProperty";
import { TitleLink } from "@/datas/TitleLink";
import { DocketVariantRequest } from "@/models/DocketVariant";
import MessageUtils from "@/utils/MessageUtils";
import PageConfigs from "@/utils/PageConfigs";
import { z } from "zod";
import WarehouseConfigs from "../warehouse/WarehouseConfigs";

class DocketConfigs extends Configs {
    static managerPath = ManagerPath.DOCKET;
    static resourceUrl = ResourceURL.DOCKET;
    static resourceKey = "dockets";
    static createTitle = "Thêm phiếu nhập xuất kho";
    static updateTitle = "Cập nhật phiếu nhập xuất kho";
    static manageTitle = "Quản lý phiếu nhập xuất kho";

    static manageTitleLinks: TitleLink[] = WarehouseConfigs.manageTitleLinks;

    protected static _rawProperties = {
        ...PageConfigs.getProperties(true, true),
        type: {
            label: "Loại phiếu NXK",
            type: EntityPropertyType.NUMBER,
            isShowInTable: true,
        },
        code: {
            label: "Mã phiếu NXK",
            type: EntityPropertyType.STRING,
            isShowInTable: true,
        },
        totalVariants: {
            label: "Số mặt hàng",
            type: EntityPropertyType.PLACEHOLDER,
            isShowInTable: true,
            isNotAddToSortCriteria: true,
            isNotAddToFilterCriteria: true,
        },
        "reason.name": {
            label: "Tên lý do phiếu NXK",
            type: EntityPropertyType.STRING,
            isShowInTable: true,
        },
        "warehouse.name": {
            label: "Tên nhà kho",
            type: EntityPropertyType.STRING,
            isShowInTable: true,
        },
        note: {
            label: "Ghi chú phiếu NXK",
            type: EntityPropertyType.STRING,
            isNotAddToSortCriteria: true,
            isNotAddToFilterCriteria: true,
        },
        status: {
            label: "Trạng thái phiếu NXK",
            type: EntityPropertyType.NUMBER,
            isShowInTable: true,
        },
    };

    static properties = DocketConfigs._rawProperties as EntityPropertySchema<
        typeof DocketConfigs._rawProperties & typeof PageConfigs.properties
    >;

    static initialCreateUpdateFormValues = {
        type: "1",
        code: "",
        reasonId: null as string | null,
        warehouseId: null as string | null,
        docketVariants: [] as DocketVariantRequest[],
        purchaseOrderId: null as string | null,
        orderId: null as string | null,
        note: "",
        status: "1",
    };

    static createUpdateFormSchema = z.object({
        type: z.string(),
        code: z
            .string()
            .min(5, MessageUtils.min(DocketConfigs.properties.code.label, 5)),
        reasonId: z.string({ invalid_type_error: "Vui lòng không bỏ trống" }),
        warehouseId: z.string({
            invalid_type_error: "Vui lòng không bỏ trống",
        }),
        docketVariants: z
            .array(
                z.object({
                    variantId: z.number(),
                    quantity: z.number(),
                }),
            )
            .min(1, "Cần thêm ít nhất 1 mặt hàng"),
        purchaseOrderId: z.string().nullable(),
        orderId: z.string().nullable(),
        note: z.string(),
        status: z.string(),
    });
}

export default DocketConfigs;
