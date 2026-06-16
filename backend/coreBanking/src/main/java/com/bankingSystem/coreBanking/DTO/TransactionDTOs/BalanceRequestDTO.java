package com.bankingSystem.coreBanking.DTO.TransactionDTOs;

public class BalanceRequestDTO {
    private String accountNumber;
    private String pin;

    // Getters and Setters
    public String getAccountNumber() {
        return accountNumber;
    }
    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getPin() {
        return pin;
    }
    public void setPin(String pin) {
        this.pin = pin;
    }
}
