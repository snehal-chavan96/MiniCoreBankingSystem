package com.bankingSystem.coreBanking.Entity.UserKYC;

import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "kyc_request")
@Getter
@Setter
public class UserKYCEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long kycId;

    @OneToOne
    @JoinColumn(name="user_id", nullable = false)
    private SignUpUserEntity user;

    @Column(nullable = false, length = 20)
    private String aadharNumber;

    @Column(nullable = false, length = 20)
    private String panNumber;

    @Lob
    @Column(name = "document_file", columnDefinition = "LONGBLOB", nullable = false)
    private byte[] documentFile;

    @Column(nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();
}
