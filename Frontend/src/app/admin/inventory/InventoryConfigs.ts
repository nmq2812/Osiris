import ResourceURL from "@/constants/ResourceURL";
import { Configs } from "@/datas/Configs";
import { TitleLink } from "@/datas/TitleLink";
import WarehouseConfigs from "./warehouse/WarehouseConfigs";

class InventoryConfigs extends Configs {
    static productInventoryResourceUrl = ResourceURL.PRODUCT_INVENTORY;
    static productInventoryResourceKey = "product-inventories";
    static manageTitle = "Theo dõi tồn kho sản phẩm";
    static manageTitleLinks: TitleLink[] = WarehouseConfigs.manageTitleLinks;
}

export default InventoryConfigs;
