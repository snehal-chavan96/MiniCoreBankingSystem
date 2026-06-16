package com.bankingSystem.coreBanking.Entity.FixedDeposit;

import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "fixed_deposits")
public class FixedDeposit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fdId;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(unique = true, nullable = false, length = 32)
    private String fdNumber;              // external reference

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal principalAmount;

    @Column(nullable = false)
    private double interestRate;          // %

    @Column(nullable = false)
    private int tenureMonths;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime maturityDate;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal maturityAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private FDStatus status = FDStatus.ACTIVE;

    @Column(nullable = false)
    private boolean isAutoRenewal = false;

    private LocalDateTime prematureClosureDate;

    @Column(precision = 5, scale = 4)     // e.g. 0.0100 = 1%
    private BigDecimal prematurePenaltyRate;

    private Long parentFdId;
    private String renewalBatchId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum FDStatus {
        ACTIVE,
        MATURED,
        CLOSED,
        RENEWED
    }
}
