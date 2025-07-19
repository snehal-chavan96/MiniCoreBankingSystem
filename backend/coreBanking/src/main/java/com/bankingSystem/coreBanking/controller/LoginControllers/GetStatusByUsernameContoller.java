package com.bankingSystem.coreBanking.controller.LoginControllers;

import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class GetStatusByUsernameContoller {
    @Autowired
    private UserSignUpRepo userByusername;
    @GetMapping("/user/details/{username}")
    public ResponseEntity<?> getUserDetails(@PathVariable String username) {
        SignUpUserEntity user = userByusername.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        return ResponseEntity.ok(user);
    }
}
