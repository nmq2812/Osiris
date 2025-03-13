package backend.osiris.mapper.product;

import backend.osiris.dto.product.TagRequest;
import backend.osiris.dto.product.TagResponse;
import backend.osiris.entity.product.Tag;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TagMapper extends GenericMapper<Tag, TagRequest, TagResponse> {
}