package backend.osiris.service.product;

import backend.osiris.dto.product.TagRequest;
import backend.osiris.dto.product.TagResponse;
import backend.osiris.service.CrudService;

public interface TagService extends CrudService<Long, TagRequest, TagResponse> {}