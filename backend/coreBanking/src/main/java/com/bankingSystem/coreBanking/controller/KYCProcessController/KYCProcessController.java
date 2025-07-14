package com.bankingSystem.coreBanking.controller.KYCProcessController;

import com.bankingSystem.coreBanking.DTO.KYCProcessDTO;
import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Entity.UserKYC.UserKYCEntity;
import com.bankingSystem.coreBanking.Repository.KYCRepos.KYCProcessRepo;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")

public class KYCProcessController {
    @Autowired
    private UserSignUpRepo userSignUpRepo;

    @Autowired
    private KYCProcessRepo kycProcessRepo;

    @PostMapping("/processKYC")

    public ResponseEntity<String> processKYC(@RequestBody KYCProcessDTO kycProcessDTO){
        SignUpUserEntity user = userSignUpRepo.findById(kycProcessDTO.getUserId()).orElse(null);
        if(user == null){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User not present in Database hence cant proceed for KYC!");
        }
        UserKYCEntity kyc = new UserKYCEntity();
        kyc.setUser(user);
        kyc.setAadharNumber(kycProcessDTO.getAadharNumber());
        kyc.setPanNumber(kycProcessDTO.getPanNumber());
        kyc.setDocumentFile(kycProcessDTO.getDocumentFile());
        kycProcessRepo.save(kyc);

        return ResponseEntity.status(HttpStatus.OK).body("User's KYC done Successfully");
    }
}
