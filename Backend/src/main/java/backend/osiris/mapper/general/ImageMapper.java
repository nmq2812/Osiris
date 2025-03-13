package backend.osiris.mapper.general;

import backend.osiris.dto.general.ImageRequest;
import backend.osiris.dto.general.ImageResponse;
import backend.osiris.entity.general.Image;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ImageMapper extends GenericMapper<Image, ImageRequest, ImageResponse> {}