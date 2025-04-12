package backend.osiris.service.reward;

import backend.osiris.dto.reward.RewardStrategyRequest;
import backend.osiris.dto.reward.RewardStrategyResponse;
import backend.osiris.service.CrudService;

public interface RewardStrategyService extends CrudService<Long, RewardStrategyRequest, RewardStrategyResponse> {}