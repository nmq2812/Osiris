package backend.osiris.dto.chat;

import lombok.Data;

@Data
public class RoomRequest {
    private String name;
    private Long userId;
}