package com.bankingSystem.coreBanking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long txnId;

    @ManyToOne
    @JoinColumn(name = "from_account_id")
    private Account fromAccount;

    @ManyToOne
    @JoinColumn(name = "to_account_id")
    private Account toAccount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TxnType txnType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private TxnStatus status = TxnStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime txnTime = LocalDateTime.now();

    public enum TxnType {
        DEBIT, CREDIT, INTERNAL_TRANSFER, FD
    }

    public enum TxnStatus {
        SUCCESS, FAILED, PENDING
    }
}