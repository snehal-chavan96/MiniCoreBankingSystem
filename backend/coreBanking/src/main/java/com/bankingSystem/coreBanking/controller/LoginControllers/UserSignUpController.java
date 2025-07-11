package com.bankingSystem.coreBanking.controller.LoginControllers;

import com.bankingSystem.coreBanking.Entity.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.AuthenticationRepos.UserSignUpRepo;
import com.bankingSystem.coreBanking.Service.AuthenticationServices.UserSignUpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api")

public class UserSignUpController {
    @Autowired
    private UserSignUpService userSignUpService;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    @PostMapping("/signUp")
    public ResponseEntity<?> userLogin(@RequestBody SignUpUserEntity signupData) {
        signupData.setHashPassword(encoder.encode(signupData.getHashPassword()));
        try {
            SignUpUserEntity savedUser = userSignUpService.register(signupData);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }


    // Just to fetch all the users
    @Autowired
    private UserSignUpRepo allUsers;
    @GetMapping("/getUsers")
    public List<SignUpUserEntity> getUsers(){
        return new ArrayList<>(allUsers.findAll());
    }

    // Fetch User according to username
    @Autowired
    private UserSignUpRepo userByusername;
    @GetMapping("/user/{username}")
    public SignUpUserEntity getUserByUsername(@PathVariable String username){
        return userByusername.findByUsername(username);
    }
}
