package backend.osiris.service.auth;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.authentication.RegistrationRequest;
import backend.osiris.dto.authentication.ResetPasswordRequest;
import backend.osiris.dto.authentication.UserRequest;
import backend.osiris.entity.authentication.Role;
import backend.osiris.entity.authentication.User;
import backend.osiris.entity.authentication.Verification;
import backend.osiris.entity.authentication.VerificationType;
import backend.osiris.entity.customer.Customer;
import backend.osiris.entity.customer.CustomerGroup;
import backend.osiris.entity.customer.CustomerResource;
import backend.osiris.entity.customer.CustomerStatus;
import backend.osiris.exception.ExpiredTokenException;
import backend.osiris.exception.VerificationException;
import backend.osiris.mapper.authentication.UserMapper;
import backend.osiris.repository.authentication.UserRepository;
import backend.osiris.repository.authentication.VerificationRepository;
import backend.osiris.repository.customer.CustomerRepository;
import backend.osiris.service.email.EmailSenderService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import net.bytebuddy.utility.RandomString;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;

@Service
@Transactional(rollbackOn = VerificationException.class, dontRollbackOn = ExpiredTokenException.class)
public class VerificationServiceImpl implements VerificationService {

    private final UserRepository userRepository;
    private final VerificationRepository verificationRepository;
    private final UserMapper userMapper;
    private final EmailSenderService emailSenderService;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public VerificationServiceImpl(UserRepository userRepository, VerificationRepository verificationRepository, UserMapper userMapper, @Lazy EmailSenderService emailSenderService, CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.verificationRepository = verificationRepository;
        this.userMapper = userMapper;
        this.emailSenderService = emailSenderService;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Long generateTokenVerify(UserRequest userRequest) {
        // (1) Check if username exists in database
        if (userRepository.existsUserByUsername(userRequest.getUsername())) {
            throw new VerificationException("Username is existing");
        }

        // (2) Check if email existing in database
        if (userRepository.existsUserByEmail(userRequest.getEmail())) {
            throw new VerificationException("Email is existing");
        }

        // (3) Create user entity with status 2 (non-verified) and set role Customer
        User user = userMapper.requestToEntity(userRequest);
        user.setStatus(2); // Non-verified
        user.setRoles(Set.of((Role) new Role().setId(3L)));

        userRepository.save(user);

        // (4) Create new verification entity and set user, token
        Verification verification = new Verification();
        String token = generateVerificationToken();

        verification.setUser(user);
        verification.setToken(token);
        verification.setExpiredAt(Instant.now().plus(5, ChronoUnit.MINUTES));
        verification.setType(VerificationType.REGISTRATION);

        verificationRepository.save(verification);

        // (5) Send email
        Map<String, Object> attributes = Map.of(
                "token", token,
                "link", MessageFormat.format("{0}/signup?userId={1}", AppConstants.FRONTEND_HOST, user.getId()));
        emailSenderService.sendVerificationToken(user.getEmail(), attributes);

        return user.getId();
    }

    @Override
    public void resendRegistrationToken(Long userId) {
        Optional<Verification> verifyOpt = verificationRepository.findByUserId(userId);

        if (verifyOpt.isPresent()) {
            Verification verification = verifyOpt.get();
            String token = generateVerificationToken();

            verification.setToken(token);
            verification.setExpiredAt(Instant.now().plus(5, ChronoUnit.MINUTES));

            verificationRepository.save(verification);

            Map<String, Object> attributes = Map.of(
                    "token", token,
                    "link", MessageFormat.format("{0}/signup?userId={1}", AppConstants.FRONTEND_HOST, userId));
            emailSenderService.sendVerificationToken(verification.getUser().getEmail(), attributes);
        } else {
            throw new VerificationException("User ID is invalid. Please try again!");
        }
    }

    @Override
    public void confirmRegistration(RegistrationRequest registration) {
        Optional<Verification> verifyOpt = verificationRepository.findByUserId(registration.getUserId());

        if (verifyOpt.isPresent()) {
            Verification verification = verifyOpt.get();

            boolean validVerification = verification.getToken().equals(registration.getToken())
                    && verification.getExpiredAt().isAfter(Instant.now())
                    && verification.getType().equals(VerificationType.REGISTRATION);

            if (validVerification) {
                // (1) Set status code and delete row verification
                User user = verification.getUser();
                user.setStatus(1); // Verified
                userRepository.save(user);
                verificationRepository.delete(verification);

                // (2) Create customer entity
                Customer customer = new Customer();
                customer.setUser(user);
                customer.setCustomerGroup((CustomerGroup) new CustomerGroup().setId(1L));
                customer.setCustomerStatus((CustomerStatus) new CustomerStatus().setId(1L));
                customer.setCustomerResource((CustomerResource) new CustomerResource().setId(1L));
                customerRepository.save(customer);
            }

            boolean tokenIsExpired = verification.getToken().equals(registration.getToken())
                    && !verification.getExpiredAt().isAfter(Instant.now())
                    && verification.getType().equals(VerificationType.REGISTRATION);

            if (tokenIsExpired) {
                String token = generateVerificationToken();

                verification.setToken(token);
                verification.setExpiredAt(Instant.now().plus(5, ChronoUnit.MINUTES));

                verificationRepository.save(verification);

                Map<String, Object> attributes = Map.of(
                        "token", token,
                        "link", MessageFormat.format("{0}/signup?userId={1}", AppConstants.FRONTEND_HOST, registration.getUserId()));
                emailSenderService.sendVerificationToken(verification.getUser().getEmail(), attributes);

                throw new ExpiredTokenException("Token is expired, please check your email to get new token!");
            }

            if (!verification.getToken().equals(registration.getToken())) {
                throw new VerificationException("Invalid token");
            }
        } else {
            throw new VerificationException("User does not exist");
        }
    }

    @Override
    public void changeRegistrationEmail(Long userId, String emailUpdate) {
        Optional<Verification> verifyOpt = verificationRepository.findByUserId(userId);

        if (verifyOpt.isPresent()) {
            Verification verification = verifyOpt.get();

            User user = verification.getUser();
            user.setEmail(emailUpdate);
            userRepository.save(user);

            String token = generateVerificationToken();
            verification.setToken(token);
            verification.setExpiredAt(Instant.now().plus(5, ChronoUnit.MINUTES));
            verificationRepository.save(verification);

            Map<String, Object> attributes = Map.of(
                    "token", token,
                    "link", MessageFormat.format("{0}/signup?userId={1}", AppConstants.FRONTEND_HOST, userId));
            emailSenderService.sendVerificationToken(verification.getUser().getEmail(), attributes);
        } else {
            throw new VerificationException("User does not exist");
        }
    }

    @Override
    public void forgetPassword(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email doesn't exist"));

        if (user.getStatus() == 1) {
            String token = RandomString.make(10);
            user.setResetPasswordToken(token);
            userRepository.save(user);

            String link = MessageFormat.format("{0}/change-password?token={1}&email={2}", AppConstants.FRONTEND_HOST, token, email);
            emailSenderService.sendForgetPasswordToken(user.getEmail(), Map.of("link", link));
        } else {
            throw new VerificationException("Account is not activated");
        }
    }

    @Override
    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
        User user = userRepository
                .findByEmailAndResetPasswordToken(resetPasswordRequest.getEmail(), resetPasswordRequest.getToken())
                .orElseThrow(() -> new RuntimeException("Email and/or token are invalid"));
        user.setPassword(passwordEncoder.encode(resetPasswordRequest.getPassword()));
        userRepository.save(user);
    }

    private String generateVerificationToken() {
        Random random = new Random();
        return String.format("%04d", random.nextInt(10000));
    }

}