package com.bankingSystem.coreBanking.controller.KYCProcessController;

import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Entity.UserKYC.UserKYCEntity;
import com.bankingSystem.coreBanking.Repository.KYCRepos.KYCProcessRepo;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:5173")
public class KYCProcessController {

    private static final Logger logger = LoggerFactory.getLogger(KYCProcessController.class);

    @Autowired
    private UserSignUpRepo userSignUpRepo;

    @Autowired
    private KYCProcessRepo kycProcessRepo;

    @PostMapping("/processKYC")
    public ResponseEntity<String> processKYC(
            @RequestParam("userId") Long userId,
            @RequestParam("aadharNumber") String aadharNumber,
            @RequestParam("panNumber") String panNumber,
            @RequestParam("documentFile") MultipartFile documentFile) {

        logger.info("Received KYC request for userId: {}", userId);

        try {
            SignUpUserEntity user = userSignUpRepo.findById(userId).orElse(null);

            if (user == null) {
                logger.warn("User not found.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("User not present in the database.");
            }

            UserKYCEntity kyc = new UserKYCEntity();
            kyc.setUser(user);
            kyc.setAadharNumber(aadharNumber);
            kyc.setPanNumber(panNumber);
            kyc.setDocumentFile(documentFile.getBytes());

            kycProcessRepo.save(kyc);
            user.setStatus(SignUpUserEntity.Status.ACTIVE);  // enum inside SignUpUserEntity
            userSignUpRepo.save(user);

            return ResponseEntity.ok("KYC completed and status set to ACTIVE.");

        } catch (Exception e) {
            logger.error("KYC failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}
