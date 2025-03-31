package backend.osiris.mapper.inventory;

import backend.osiris.dto.inventory.TransferRequest;
import backend.osiris.dto.inventory.TransferResponse;
import backend.osiris.entity.inventory.Transfer;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = DocketMapper.class)
public interface TransferMapper extends GenericMapper<Transfer, TransferRequest, TransferResponse> {}
