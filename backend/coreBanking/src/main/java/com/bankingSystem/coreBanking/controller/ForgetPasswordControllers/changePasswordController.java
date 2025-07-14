package com.bankingSystem.coreBanking.controller.ForgetPasswordControllers;

import com.bankingSystem.coreBanking.DTO.ForgetPasswordDTO.ChangePasswordDTO;
import com.bankingSystem.coreBanking.Service.ChangePasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:5173")
public class changePasswordController {
    @Autowired
    ChangePasswordService changePasswordService;

    @PutMapping("/change-password/{username}")
    public ResponseEntity<String> changePassword(@PathVariable String username, @RequestBody ChangePasswordDTO password){
        return changePasswordService.changePassword(username, password);
    }
}
