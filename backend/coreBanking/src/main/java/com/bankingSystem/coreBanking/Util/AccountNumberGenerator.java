package com.bankingSystem.coreBanking.Util;

import com.bankingSystem.coreBanking.Entity.Accounts.Account;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

public class AccountNumberGenerator {

    private static final String PREFIX = "FCX";
    private static final Random random = new Random();

    public static String generate(Account.AccountType type) {
        String timePart = new SimpleDateFormat("ssSSS").format(new Date());
        int randomPart = 1000 + random.nextInt(9000);

        String numericPart = (timePart + randomPart);

        numericPart = numericPart.length() > 9
                ? numericPart.substring(0, 9)
                : String.format("%09d", Long.parseLong(numericPart));

        // Final account number: FCX + 9-digit number = 12 digits total
        return PREFIX + numericPart;
    }
}
