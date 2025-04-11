package backend.osiris.service.chat;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.chat.RoomRequest;
import backend.osiris.dto.chat.RoomResponse;
import backend.osiris.mapper.chat.RoomMapper;
import backend.osiris.repository.chat.RoomRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RoomServiceImpl implements RoomService {

    private RoomRepository roomRepository;

    private RoomMapper roomMapper;

    @Override
    public ListResponse<RoomResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.ROOM, roomRepository, roomMapper);
    }

    @Override
    public RoomResponse findById(Long id) {
        return defaultFindById(id, roomRepository, roomMapper, ResourceName.ROOM);
    }

    @Override
    public RoomResponse save(RoomRequest request) {
        return defaultSave(request, roomRepository, roomMapper);
    }

    @Override
    public RoomResponse save(Long id, RoomRequest request) {
        return defaultSave(id, request, roomRepository, roomMapper, ResourceName.ROOM);
    }

    @Override
    public void delete(Long id) {
        roomRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        roomRepository.deleteAllById(ids);
    }

}