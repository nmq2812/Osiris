package backend.osiris.mapper.product;

import backend.osiris.dto.product.CategoryRequest;
import backend.osiris.dto.product.CategoryResponse;
import backend.osiris.entity.product.Category;
import backend.osiris.mapper.GenericMapper;
import backend.osiris.utils.MapperUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = MapperUtils.class)
public interface CategoryMapper extends GenericMapper<Category, CategoryRequest, CategoryResponse> {

    @Override
    @Mapping(source = "parentCategoryId", target = "parentCategory")
    Category requestToEntity(CategoryRequest request);

    @Override
    @Mapping(source = "parentCategoryId", target = "parentCategory")
    Category partialUpdate(@MappingTarget Category entity, CategoryRequest request);

}