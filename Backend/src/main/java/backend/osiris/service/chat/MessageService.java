package backend.osiris.service.chat;

import backend.osiris.dto.chat.MessageRequest;
import backend.osiris.dto.chat.MessageResponse;
import backend.osiris.service.CrudService;

public interface MessageService extends CrudService<Long, MessageRequest, MessageResponse> {}
