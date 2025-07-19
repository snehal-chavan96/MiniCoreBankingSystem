package com.bankingSystem.coreBanking.DTO;

import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Getter
@Setter
public class KYCProcessDTO {
    @NotNull(message = "User Id cannot be NULL")
    private long userId;

    @NotNull(message = "Aadhar Number also can't be NULL")
    private String aadharNumber;

    @NotNull(message = "Pan Number also can't be NULL")
    private String panNumber;

    @NotNull(message = "Document File needs to be uploaded")
    private MultipartFile documentFile;
}
