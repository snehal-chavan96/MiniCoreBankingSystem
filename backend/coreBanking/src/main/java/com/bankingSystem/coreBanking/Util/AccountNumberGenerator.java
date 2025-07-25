package com.bankingSystem.coreBanking.Util;

import com.bankingSystem.coreBanking.Entity.Accounts.Account;

import java.util.concurrent.atomic.AtomicLong;

public class AccountNumberGenerator
{
    private static final AtomicLong counter = new AtomicLong(1000000000L);

    /**
     * Generate a unique account number.
     * Pattern: <PREFIX><9-digit-sequence>
     * Example: SAV1000000001 or CUR1000000002
     */
    public static String generate(Account.AccountType type) {
        String prefix = "FCX";
        return prefix + counter.incrementAndGet();
    }
}
