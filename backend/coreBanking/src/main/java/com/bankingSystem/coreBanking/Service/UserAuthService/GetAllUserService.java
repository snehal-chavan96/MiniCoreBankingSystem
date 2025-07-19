package com.bankingSystem.coreBanking.Service.UserAuthService;

import com.bankingSystem.coreBanking.DTO.AllUsersDataDTO;
import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GetAllUserService{
    @Autowired
    private UserSignUpRepo userSignUpRepo;
    public List<AllUsersDataDTO> getAllUsers(){
        return userSignUpRepo.findAll().stream()
                .map(AllUsersDataDTO::new)
                .collect(Collectors.toList());
    }
}
