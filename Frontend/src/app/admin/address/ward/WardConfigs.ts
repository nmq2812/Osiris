import ManagerPath from "@/constants/ManagerPath";
import ResourceURL from "@/constants/ResourceURL";
import { Configs } from "@/datas/Configs";

class WardConfigs extends Configs {
    static managerPath = ManagerPath.WARD;
    static resourceUrl = ResourceURL.WARD;
    static resourceKey = "wards";
    static createTitle = "Thêm phường xã";
    static updateTitle = "Cập nhật phường xã";
    static manageTitle = "Quản lý phường xã";
}

export default WardConfigs;
