package com.bankingSystem.coreBanking.controller.LoginControllers;

import com.bankingSystem.coreBanking.DTO.AuthDTO.LoginDTO;
import com.bankingSystem.coreBanking.Service.UserAuthService.UserAuthService;
import com.bankingSystem.coreBanking.Util.JwtUtil;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:5173")
public class LoginAuthController {

    private static final Logger logger = LoggerFactory.getLogger(LoginAuthController.class);

    @Autowired
    private UserAuthService userAuthService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO loginCredentials, BindingResult bindingResult) {

        logger.info("Login attempt received for username: {}", loginCredentials.getUsername());

        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldError().getDefaultMessage();
            logger.warn("Validation error for login: {}", errorMessage);
            return ResponseEntity.badRequest().body(Map.of("message", errorMessage));
        }

        boolean authenticated = userAuthService.verifyUsersCredential(
                loginCredentials.getUsername(),
                loginCredentials.getPassword()
        );

        if (authenticated) {
            logger.info("Authentication successful for username: {}", loginCredentials.getUsername());
            String token = jwtUtil.generateToken(loginCredentials.getUsername());

            logger.debug("JWT token generated for user {}: {}", loginCredentials.getUsername(), token);
            return ResponseEntity.ok().body(
                    Map.of(
                            "message", "Login successful!",
                            "token", token
                    )
            );
        } else {
            logger.warn("Authentication failed for username: {}", loginCredentials.getUsername());
            return ResponseEntity.status(401).body(
                    Map.of("message", "Invalid Credentials!!")
            );
        }
    }
}
