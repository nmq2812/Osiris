package backend.osiris.mapper.product;

import backend.osiris.dto.product.BrandRequest;
import backend.osiris.dto.product.BrandResponse;
import backend.osiris.entity.product.Brand;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BrandMapper extends GenericMapper<Brand, BrandRequest, BrandResponse> {}