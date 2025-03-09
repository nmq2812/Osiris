package backend.osiris.mapper.address;

import backend.osiris.dto.address.ProvinceRequest;
import backend.osiris.dto.address.ProvinceResponse;
import backend.osiris.entity.address.Province;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProvinceMapper extends GenericMapper<Province, ProvinceRequest, ProvinceResponse> {
}