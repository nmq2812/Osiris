package backend.osiris.mapper.chat;

import backend.osiris.dto.chat.MessageRequest;
import backend.osiris.dto.chat.MessageResponse;
import backend.osiris.entity.chat.Message;
import backend.osiris.mapper.GenericMapper;
import backend.osiris.utils.MapperUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = MapperUtils.class)
public interface MessageMapper extends GenericMapper<Message, MessageRequest, MessageResponse> {

    @Override
    @Mapping(source = "userId", target = "user")
    @Mapping(source = "roomId", target = "room")
    Message requestToEntity(MessageRequest request);

}
