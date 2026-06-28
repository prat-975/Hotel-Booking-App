package com.hotelbooking.service;

import com.hotelbooking.dto.AuthResponse;
import com.hotelbooking.dto.GoogleAuthRequest;
import com.hotelbooking.dto.LoginRequest;
import com.hotelbooking.dto.RegisterRequest;
import com.hotelbooking.dto.UserResponse;
import com.hotelbooking.exception.BadRequestException;
import com.hotelbooking.exception.UnauthorizedException;
import com.hotelbooking.model.AuthProvider;
import com.hotelbooking.model.User;
import com.hotelbooking.repository.UserRepository;
import com.hotelbooking.security.GoogleTokenVerifier;
import com.hotelbooking.security.JwtService;
import com.hotelbooking.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final GoogleTokenVerifier googleTokenVerifier;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       GoogleTokenVerifier googleTokenVerifier,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.googleTokenVerifier = googleTokenVerifier;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setProvider(AuthProvider.LOCAL);

        userRepository.save(user);
        emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (user.getProvider() == AuthProvider.GOOGLE && user.getPassword() == null) {
            throw new BadRequestException("This account uses Google Sign-In. Please log in with Google.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase(),
                            request.getPassword()
                    )
            );
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            return buildAuthResponse(principal.getUser());
        } catch (Exception ex) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    public AuthResponse googleLogin(GoogleAuthRequest request) {
        GoogleTokenVerifier.GoogleUserInfo googleUser = googleTokenVerifier.verify(request.getIdToken());

        User user = userRepository.findByGoogleId(googleUser.getGoogleId())
                .orElseGet(() -> userRepository.findByEmailIgnoreCase(googleUser.getEmail())
                        .orElse(null));

        boolean isNewUser = user == null;

        if (isNewUser) {
            user = new User();
            user.setEmail(googleUser.getEmail().toLowerCase());
            user.setName(googleUser.getName());
            user.setGoogleId(googleUser.getGoogleId());
            user.setProfileImageUrl(googleUser.getPicture());
            user.setProvider(AuthProvider.GOOGLE);
        } else {
            user.setGoogleId(googleUser.getGoogleId());
            user.setName(googleUser.getName());
            user.setProfileImageUrl(googleUser.getPicture());
            if (user.getProvider() == null) {
                user.setProvider(AuthProvider.GOOGLE);
            }
        }

        userRepository.save(user);

        if (isNewUser) {
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        }

        return buildAuthResponse(user);
    }

    public UserResponse getCurrentUser(UserPrincipal principal) {
        return toUserResponse(principal.getUser());
    }

    private AuthResponse buildAuthResponse(User user) {
        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtService.generateToken(principal);
        return new AuthResponse(token, toUserResponse(user));
    }

    public static UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getProfileImageUrl(),
                user.getProvider() != null ? user.getProvider().name() : AuthProvider.LOCAL.name()
        );
    }
}
