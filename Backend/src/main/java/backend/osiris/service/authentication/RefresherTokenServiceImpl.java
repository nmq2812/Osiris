package backend.osiris.service.authentication;

import backend.osiris.constant.FieldName;
import backend.osiris.constant.ResourceName;
import backend.osiris.entity.authentication.RefreshToken;
import backend.osiris.exception.RefreshTokenException;
import backend.osiris.exception.ResourceNotFoundException;
import backend.osiris.repository.authentication.RefreshTokenRepository;
import backend.osiris.repository.authentication.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefresherTokenServiceImpl implements RefreshTokenService {

    @Value("${osiris.app.jwtRefreshExpirationMs}")
    private int jwtRefreshExpirationMs;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    public RefreshToken createRefreshToken(Authentication authentication) {
        String username = authentication.getName();
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceName.USER, FieldName.USERNAME, username)));
        refreshToken.setExpiryDate(Instant.now().plusMillis(jwtRefreshExpirationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken refreshToken) {
        if (refreshToken.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(refreshToken);
            throw new RefreshTokenException("Refresh token was expired. Please make a new signin request!");
        }

        return refreshToken;
    }
}