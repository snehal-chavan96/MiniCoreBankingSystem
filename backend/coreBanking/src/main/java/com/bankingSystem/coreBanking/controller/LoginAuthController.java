package com.bankingSystem.coreBanking.controller;
import com.bankingSystem.coreBanking.DTO.LoginDTO;
import com.bankingSystem.coreBanking.service.UserAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class LoginAuthController {
    @Autowired
    private UserAuthService userAuthService;
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginCredentials){
        boolean authenticated = userAuthService.verifyUsersCredential(loginCredentials.getUsername(), loginCredentials.getPassword());

        if(authenticated){
            return ResponseEntity.ok("Login Successfull!");
        }
        else {
            return ResponseEntity.status(401).body("Invalid Credentials!!");
        }
    }
}
