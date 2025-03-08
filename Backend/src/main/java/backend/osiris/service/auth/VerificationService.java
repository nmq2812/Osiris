package backend.osiris.service.auth;

import backend.osiris.dto.authentication.RegistrationRequest;
import backend.osiris.dto.authentication.ResetPasswordRequest;
import backend.osiris.dto.authentication.UserRequest;

public interface VerificationService {

    Long generateTokenVerify(UserRequest userRequest);

    void resendRegistrationToken(Long userId);

    void confirmRegistration(RegistrationRequest registration);

    void changeRegistrationEmail(Long userId, String emailUpdate);

    void forgetPassword(String email);

    void resetPassword(ResetPasswordRequest resetPasswordRequest);

}