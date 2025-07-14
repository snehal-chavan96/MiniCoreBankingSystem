package com.bankingSystem.coreBanking.controller.LoginControllers;

import com.bankingSystem.coreBanking.DTO.LoginDTO;
import com.bankingSystem.coreBanking.Service.UserAuthService.UserAuthService;
import com.bankingSystem.coreBanking.Util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:5173")
public class LoginAuthController {

    @Autowired
    private UserAuthService userAuthService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO loginCredentials, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldError().getDefaultMessage();
            return ResponseEntity.badRequest().body(Map.of("message", errorMessage)); // 🔒 JSON on bad input
        }

        boolean authenticated = userAuthService.verifyUsersCredential(
                loginCredentials.getUsername(),
                loginCredentials.getPassword()
        );

        if (authenticated) {
            String token = jwtUtil.generateToken(loginCredentials.getUsername());

            return ResponseEntity.ok().body(
                    Map.of(
                            "message", "Login successful!",
                            "token", token
                    )
            );
        } else {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Invalid Credentials!!")  // ✅ Fix is here
            );
        }
    }

}
