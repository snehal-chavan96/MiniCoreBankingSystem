package com.bankingSystem.coreBanking.Util;

import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import com.bankingSystem.coreBanking.Entity.Transaction.Transaction;
import com.bankingSystem.coreBanking.Repository.AccountRepository.AccountRepository;
import com.bankingSystem.coreBanking.Repository.TransactionRepo.TransactionRepository;
import com.bankingSystem.coreBanking.Service.EmailService.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.activation.DataSource;
import jakarta.mail.util.ByteArrayDataSource;

@Slf4j
@Component
@RequiredArgsConstructor
public class MonthlyStatementScheduler {

    private final EmailService emailService;
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    //0 */5 * * * * for seconds
    // Runs every 2 minutes (for testing). Use: "0 0 9 1 * *" for monthly schedule on 1st at 9 AM.
    @Scheduled(cron = "0 0/5 * * * *")
    public void sendMonthlyStatements() {
        log.info("📩 Running monthly statement scheduler at {}", LocalDateTime.now());

        List<Account> accounts = accountRepository.findAll();

        LocalDateTime startDate = getStartDate(); // 15th of previous month at 00:00
        LocalDateTime endDate = getNow();         // current date and time

        for (Account account : accounts) {
            try {
                String accountNumber = account.getAccountNumber();

                // Get all transactions involving this account during the period
                List<Transaction> allTxns = transactionRepository.findTransactionsForAccountInPeriod(
                        accountNumber,
                        startDate,
                        endDate
                );

                // Filter by whether the transaction is DEBIT for this account as sender or CREDIT as receiver
                List<Transaction> filteredTxns = allTxns.stream()
                        .filter(txn ->
                                (txn.getFromAccount() != null &&
                                        txn.getFromAccount().getAccountId().equals(account.getAccountId()) &&
                                        txn.getTxnType() == Transaction.TxnType.DEBIT)
                                        ||
                                        (txn.getToAccount() != null &&
                                                txn.getToAccount().getAccountId().equals(account.getAccountId()) &&
                                                txn.getTxnType() == Transaction.TxnType.CREDIT)
                        )
                        .collect(Collectors.toList());

                if (filteredTxns.isEmpty()) {
                    log.info(" No transactions for account: {}", accountNumber);
                    emailService.sendNoTransactionEmail(account); // Optional for empty transactions
                    continue;
                }

                emailService.sendMonthlyStatementEmail(account, filteredTxns);
                log.info(" Monthly statement sent to {}", account.getUser().getEmailId());

            } catch (Exception e) {
                log.error(" Error sending statement to account: {}", account.getAccountNumber(), e);
            }
        }
    }

    private LocalDateTime getStartDate() {
        LocalDate now = LocalDate.now();
        LocalDate fifteenthOfLastMonth = now.minusMonths(1).withDayOfMonth(15);
        return fifteenthOfLastMonth.atStartOfDay();
    }

    private LocalDateTime getNow() {
        return LocalDateTime.now();
    }
}
