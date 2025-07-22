package com.bankingSystem.coreBanking.Entity.Accounts;

import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false,unique = true)
    private SignUpUserEntity user;

    @Column(nullable = false, unique = true, length = 20)
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType type; // SAVINGS, CURRENT, JOINT

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus status; // ACTIVE, CLOSED, FROZEN

    private LocalDateTime openedAt;
    private LocalDateTime closedAt;

    @Column(nullable = false)
    private String pin; // 4 or 6 digit PIN for transactions

    public enum AccountType {
        SAVINGS, CURRENT, JOINT
    }

    public enum AccountStatus {
        ACTIVE, CLOSED, FROZEN
    }
}
