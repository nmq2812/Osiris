package backend.osiris.service.chat;

import backend.osiris.dto.chat.RoomRequest;
import backend.osiris.dto.chat.RoomResponse;
import backend.osiris.service.CrudService;

public interface RoomService extends CrudService<Long, RoomRequest, RoomResponse> {}