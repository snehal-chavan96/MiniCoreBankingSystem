package com.bankingSystem.coreBanking.DTO;

import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class AllUsersDataDTO {
    private String fullName;
    private long userId;
    private String username;
    private String EmailId;
    private String PhoneNumber;
    private SignUpUserEntity.Status status;
    private SignUpUserEntity.Role role;

    public AllUsersDataDTO(SignUpUserEntity user){
        this.fullName = user.getFullName();
        this.userId = user.getUserId();
        this.username = user.getUsername();
        this.EmailId = user.getEmailId();
        this.PhoneNumber = user.getPhoneNumber();
        this.status = user.getStatus();
        this.role = user.getRole();
    }
}
