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
import EmployeeConfigs from "../EmployeeConfigs";

class JobTitleConfigs extends Configs {
    static managerPath = ManagerPath.JOB_TITLE;
    static resourceUrl = ResourceURL.JOB_TITLE;
    static resourceKey = "job-titles";
    static createTitle = "Thêm chức danh công việc";
    static updateTitle = "Cập nhật chức danh công việc";
    static manageTitle = "Quản lý chức danh công việc";

    static manageTitleLinks: TitleLink[] = EmployeeConfigs.manageTitleLinks;

    protected static _rawProperties = {
        ...PageConfigs.getProperties(true, true, true),
        name: {
            label: "Tên chức danh công việc",
            type: EntityPropertyType.STRING,
            isShowInTable: true,
        },
        status: {
            label: "Trạng thái chức danh công việc",
            type: EntityPropertyType.NUMBER,
            isShowInTable: true,
        },
    };

    static properties = JobTitleConfigs._rawProperties as EntityPropertySchema<
        typeof JobTitleConfigs._rawProperties & typeof PageConfigs.properties
    >;

    static initialCreateUpdateFormValues = {
        name: "",
        status: "1",
    };

    static createUpdateFormSchema = z.object({
        name: z
            .string()
            .min(2, MessageUtils.min(JobTitleConfigs.properties.name.label, 2)),
        status: z.string(),
    });
}

export default JobTitleConfigs;
