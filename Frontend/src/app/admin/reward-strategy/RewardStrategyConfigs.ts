import ManagerPath from "@/constants/ManagerPath";
import ResourceURL from "@/constants/ResourceURL";
import { Configs } from "@/datas/Configs";
import { TitleLink } from "@/datas/TitleLink";

class RewardStrategyConfigs extends Configs {
    static resourceUrl = ResourceURL.REWARD_STRATEGY;
    static resourceKey = "reward-strategies";
    static manageTitle = "Quản lý chiến lược điểm thưởng";
    static manageTitleLinks: TitleLink[] = [
        {
            link: ManagerPath.REWARD_STRATEGY,
            label: "QL chiến lược điểm thưởng",
        },
    ];
}

export default RewardStrategyConfigs;
