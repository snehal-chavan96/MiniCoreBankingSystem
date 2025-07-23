package com.bankingSystem.coreBanking.Util;

import com.bankingSystem.coreBanking.Repository.FixedDepositRepository.FixedDepositRepo;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
public class FdNumberGenerator {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("ddMM");
    private final FixedDepositRepo fdRepo;

    public FdNumberGenerator(FixedDepositRepo fdRepo) {
        this.fdRepo = fdRepo;
    }

    public String generate() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        long countToday = fdRepo.countByStartDateBetween(start, end);
        String seqStr = String.format("%02d", (countToday + 1) % 100);
        String rand = UUID.randomUUID().toString().substring(0, 3).toUpperCase();

        return "FD" + today.format(DATE_FMT) + "-" + seqStr + "-" + rand;
    }
}
