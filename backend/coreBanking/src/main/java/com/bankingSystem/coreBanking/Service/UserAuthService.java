package com.bankingSystem.coreBanking.service;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.bankingSystem.coreBanking.entity.SignUpUserEntity;
import com.bankingSystem.coreBanking.repository.UserSignUpRepo;
import jakarta.validation.constraints.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserAuthService {
    @Autowired
    private UserSignUpRepo signUp;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public boolean verifyUsersCredential(String username, String password){
        SignUpUserEntity userCredentials = signUp.findByUsername(username);
        if(userCredentials == null) return false;
        return passwordEncoder.matches(password, userCredentials.getHashPassword());
    }
}
