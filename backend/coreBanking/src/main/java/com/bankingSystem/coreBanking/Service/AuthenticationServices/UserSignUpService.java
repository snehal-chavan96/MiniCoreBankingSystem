package com.bankingSystem.coreBanking.Service.AuthenticationServices;

import com.bankingSystem.coreBanking.Entity.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.AuthenticationRepos.UserCredentialsCheckRepo;
import com.bankingSystem.coreBanking.Repository.AuthenticationRepos.UserSignUpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserSignUpService {
    @Autowired
    private UserCredentialsCheckRepo checkCredentials;
    @Autowired
    private UserSignUpRepo signIn;

    public SignUpUserEntity register(SignUpUserEntity users){
        if(checkCredentials.existsByUsername(users.getUsername())){
            throw new RuntimeException("User already exists in database");
        }else{
            return signIn.save(users);
        }
    }
}
