package com.bankingSystem.coreBanking.controller;

import com.bankingSystem.coreBanking.Entity.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.UserSignUpRepo;
import com.bankingSystem.coreBanking.Service.UserSignUpService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public SignUpUserEntity UserLogin(@RequestBody SignUpUserEntity loginData){
        loginData.setHashPassword(encoder.encode(loginData.getHashPassword()));
        return userSignUpService.register(loginData);
    }

    // Just to fetch all the users
    @Autowired
    private UserSignUpRepo allUsers;
    @GetMapping("/getUsers")
    public List<SignUpUserEntity> getUsers(){
        return new ArrayList<>(allUsers.findAll());
    }
}
