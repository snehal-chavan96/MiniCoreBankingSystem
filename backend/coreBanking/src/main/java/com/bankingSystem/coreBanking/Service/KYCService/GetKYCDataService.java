package com.bankingSystem.coreBanking.Service.KYCService;

import com.bankingSystem.coreBanking.Entity.UserKYC.UserKYCEntity;
import com.bankingSystem.coreBanking.Repository.KYCRepos.KYCProcessRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetKYCDataService {
    @Autowired
    private KYCProcessRepo kycProcessRepo;

    public List<UserKYCEntity> getAllKYCUsers(){
        return kycProcessRepo.findAll();
    }
}
