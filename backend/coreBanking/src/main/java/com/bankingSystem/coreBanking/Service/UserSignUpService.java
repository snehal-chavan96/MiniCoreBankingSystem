package com.bankingSystem.coreBanking.Service;

import com.bankingSystem.coreBanking.Entity.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.UserSignUpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserSignUpService {
    @Autowired
    private UserSignUpRepo userRepo;
    public SignUpUserEntity register(SignUpUserEntity users){
        return userRepo.save(users);
    }
}
