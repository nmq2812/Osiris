package backend.osiris.controller.client;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.authentication.UserResponse;
import backend.osiris.dto.client.ClientEmailSettingUserRequest;
import backend.osiris.dto.client.ClientPasswordSettingUserRequest;
import backend.osiris.dto.client.ClientPersonalSettingUserRequest;
import backend.osiris.dto.client.ClientPhoneSettingUserRequest;
import backend.osiris.entity.authentication.User;
import backend.osiris.mapper.authentication.UserMapper;
import backend.osiris.repository.authentication.UserRepository;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/client-api/users")
@AllArgsConstructor
public class ClientUserController {

    private UserRepository userRepository;
    private UserMapper userMapper;
    private PasswordEncoder passwordEncoder;

    @GetMapping("/info")
    public ResponseEntity<UserResponse> getUserInfo(Authentication authentication) {
        String username = authentication.getName();
        UserResponse userResponse = userRepository.findByUsername(username)
                .map(userMapper::entityToResponse)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return ResponseEntity.status(HttpStatus.OK).body(userResponse);
    }

    @PostMapping("/personal")
    public ResponseEntity<UserResponse> updatePersonalSetting(Authentication authentication,
                                                              @RequestBody ClientPersonalSettingUserRequest userRequest) {
        String username = authentication.getName();
        UserResponse userResponse = userRepository.findByUsername(username)
                .map(existingUser -> userMapper.partialUpdate(existingUser, userRequest))
                .map(userRepository::save)
                .map(userMapper::entityToResponse)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return ResponseEntity.status(HttpStatus.OK).body(userResponse);
    }

    @PostMapping("/phone")
    public ResponseEntity<UserResponse> updatePhoneSetting(Authentication authentication,
                                                           @RequestBody ClientPhoneSettingUserRequest userRequest) {
        String username = authentication.getName();
        UserResponse userResponse = userRepository.findByUsername(username)
                .map(existingUser -> userMapper.partialUpdate(existingUser, userRequest))
                .map(userRepository::save)
                .map(userMapper::entityToResponse)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return ResponseEntity.status(HttpStatus.OK).body(userResponse);
    }

    @PostMapping("/email")
    public ResponseEntity<UserResponse> updateEmailSetting(Authentication authentication,
                                                           @RequestBody ClientEmailSettingUserRequest userRequest) {
        String username = authentication.getName();
        UserResponse userResponse = userRepository.findByUsername(username)
                .map(existingUser -> userMapper.partialUpdate(existingUser, userRequest))
                .map(userRepository::save)
                .map(userMapper::entityToResponse)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return ResponseEntity.status(HttpStatus.OK).body(userResponse);
    }

    @PostMapping("/password")
    public ResponseEntity<ObjectNode> updatePasswordSetting(Authentication authentication,
                                                            @RequestBody ClientPasswordSettingUserRequest userRequest) throws Exception {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));

        if (passwordEncoder.matches(userRequest.getOldPassword(), user.getPassword())) {
            String encodedNewPassword = passwordEncoder.encode(userRequest.getNewPassword());
            user.setPassword(encodedNewPassword);
            userRepository.save(user);

            // Source: https://stackoverflow.com/a/74827122
            // More: https://codingexplained.com/coding/java/spring-framework/returning-empty-json-object-spring-framework
            return ResponseEntity.status(HttpStatus.OK).body(new ObjectNode(JsonNodeFactory.instance));
        } else {
            throw new Exception("Wrong old password");
        }
    }

}