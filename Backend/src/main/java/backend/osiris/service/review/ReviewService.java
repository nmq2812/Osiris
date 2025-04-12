package backend.osiris.service.review;

import backend.osiris.dto.review.ReviewRequest;
import backend.osiris.dto.review.ReviewResponse;
import backend.osiris.service.CrudService;

public interface ReviewService extends CrudService<Long, ReviewRequest, ReviewResponse> {}
