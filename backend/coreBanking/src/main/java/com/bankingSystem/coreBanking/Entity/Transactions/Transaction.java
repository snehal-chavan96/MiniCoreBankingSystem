package com.bankingSystem.coreBanking.Entity.Transactions;

import com.bankingSystem.coreBanking.Entity.Accounts.Account;
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

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TxnType txnType;  // DEBIT, CREDIT, INTERNAL_TRANSFER, FD

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TxnStatus status; // SUCCESS, FAILED, PENDING

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(nullable = false)
    private LocalDateTime txnTime = LocalDateTime.now();

    public enum TxnType {
        DEBIT, CREDIT, INTERNAL_TRANSFER, FD
    }

    public enum TxnStatus {
        SUCCESS, FAILED, PENDING
    }
}
