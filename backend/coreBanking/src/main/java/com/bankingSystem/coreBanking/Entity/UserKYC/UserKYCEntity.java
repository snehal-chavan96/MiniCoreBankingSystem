package com.bankingSystem.coreBanking.Entity.UserKYC;

import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
//configurableregex
@Entity
@Table(name = "kyc_request")
@Getter
@Setter
public class UserKYCEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long kycId;


    @OneToOne
    @JoinColumn(name="user_id", referencedColumnName = "userId", nullable = false)
    private SignUpUserEntity user;


    @Column(nullable = false, length = 20)
    private String aadharNumber;


    @Column(nullable = false, length = 20)
    private String panNumber;

    private String documentFile;


    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING_APPROVAL;

    @Column(nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();


    public enum Status{
        PENDING_APPROVAL,
        APPROVED,
        REJECTED
    }

}
