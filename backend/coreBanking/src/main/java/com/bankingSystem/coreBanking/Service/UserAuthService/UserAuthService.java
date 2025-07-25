package com.bankingSystem.coreBanking.Service.UserAuthService;

import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
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
