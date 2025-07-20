package com.bankingSystem.coreBanking.controller.KYCProcessController;
import com.bankingSystem.coreBanking.Entity.UserKYC.UserKYCEntity;
import com.bankingSystem.coreBanking.Service.KYCService.GetKYCDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@RequestMapping("/api")
@RestController
@CrossOrigin("http://localhost:5173")
public class ViewKYCDetailsController {
    public static final Logger logger = LoggerFactory.getLogger(ViewKYCDetailsController.class);
    @Autowired
    private GetKYCDataService getKYCDataService;

    @GetMapping("getUsersKYCData")
    private ResponseEntity<List<UserKYCEntity>> getUsersWithKYC(){
        List<UserKYCEntity> allUsersWithKYC = getKYCDataService.getAllKYCUsers();
        logger.info("Fetched {} KYC Records ");
        return ResponseEntity.ok(allUsersWithKYC);
    }
}
