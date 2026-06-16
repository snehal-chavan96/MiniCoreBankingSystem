package com.bankingSystem.coreBanking.Service.AccountsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;

@Service
public class UserStatsService {

    @Autowired
    private UserSignUpRepo userSignUpRepo;

    public long getTotalUsers() {
        return userSignUpRepo.count(); // Uses JPA count
    }
}
