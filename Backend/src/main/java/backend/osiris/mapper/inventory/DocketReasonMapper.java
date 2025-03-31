package backend.osiris.mapper.inventory;

import backend.osiris.dto.inventory.DocketReasonRequest;
import backend.osiris.dto.inventory.DocketReasonResponse;
import backend.osiris.entity.inventory.DocketReason;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DocketReasonMapper extends GenericMapper<DocketReason, DocketReasonRequest, DocketReasonResponse> {}
