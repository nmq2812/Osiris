package backend.osiris.service.reward;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.reward.RewardStrategyRequest;
import backend.osiris.dto.reward.RewardStrategyResponse;
import backend.osiris.mapper.reward.RewardStrategyMapper;
import backend.osiris.repository.reward.RewardStrategyRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RewardStrategyServiceImpl implements RewardStrategyService {

    private RewardStrategyRepository rewardStrategyRepository;

    private RewardStrategyMapper rewardStrategyMapper;

    @Override
    public ListResponse<RewardStrategyResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.REWARD_STRATEGY, rewardStrategyRepository, rewardStrategyMapper);
    }

    @Override
    public RewardStrategyResponse findById(Long id) {
        return defaultFindById(id, rewardStrategyRepository, rewardStrategyMapper, ResourceName.REWARD_STRATEGY);
    }

    @Override
    public RewardStrategyResponse save(RewardStrategyRequest request) {
        return defaultSave(request, rewardStrategyRepository, rewardStrategyMapper);
    }

    @Override
    public RewardStrategyResponse save(Long id, RewardStrategyRequest request) {
        return defaultSave(id, request, rewardStrategyRepository, rewardStrategyMapper, ResourceName.REWARD_STRATEGY);
    }

    @Override
    public void delete(Long id) {
        rewardStrategyRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        rewardStrategyRepository.deleteAllById(ids);
    }

}