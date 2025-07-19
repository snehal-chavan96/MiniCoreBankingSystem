package com.bankingSystem.coreBanking.Entity.Accounts;

import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor


@Entity
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private SignUpUserEntity user;

    @Column(unique = true)
    private String accountNumber;

    private String type;
    private Double balance;
    private String status;

    private LocalDate openedAt;
    private LocalDate closedAt;

    // Getters and setters
}
