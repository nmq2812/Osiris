package backend.osiris.service.authentication;

import backend.osiris.entity.authentication.RefreshToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;

public interface RefreshTokenService {

    Optional<RefreshToken> findByToken(String token);

    RefreshToken createRefreshToken(Authentication authentication);

    RefreshToken verifyExpiration(RefreshToken refreshToken);

}