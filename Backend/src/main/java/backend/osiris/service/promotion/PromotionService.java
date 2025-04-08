package backend.osiris.service.promotion;

import backend.osiris.dto.promotion.PromotionRequest;
import backend.osiris.dto.promotion.PromotionResponse;
import backend.osiris.service.CrudService;

import java.time.Instant;

public interface PromotionService extends CrudService<Long, PromotionRequest, PromotionResponse> {

    boolean checkCanCreatePromotionForProduct(Long productId, Instant startDate, Instant endDate);

}
