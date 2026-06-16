package com.bankingSystem.coreBanking.Service.EmailService;

import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import com.bankingSystem.coreBanking.Entity.Transaction.Transaction;
import com.lowagie.text.Font;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


import java.awt.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

import java.io.ByteArrayOutputStream;
import java.util.stream.Stream;

@Slf4j
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            log.info("Email Body for {}: {}", to, body);
            helper.setText(body, true); // true = HTML
            mailSender.send(message);
            log.info(" Email sent successfully to {}", to);
        } catch (MessagingException e) {
            log.error(" Failed to send email to {}", to, e);
        }
    }

    public void sendMonthlyStatementEmail(Account account, List<Transaction> transactions) {
        String to = account.getUser().getEmailId();
        log.info(" Sending monthly statement to {}", account.getUser().getEmailId());
        String subject = "Your Monthly Transaction Statement - " + YearMonth.now().minusMonths(1);

        byte[] pdfBytes = generatePdf(account, transactions);


        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText("<p>Dear " + account.getUser().getFullName() + ",</p>"
                    + "<p>Please find attached your monthly transaction statement.</p><p>Regards,<br>Your Bank</p>", true);

            helper.addAttachment("MonthlyStatement.pdf", new ByteArrayDataSource(pdfBytes, "application/pdf"));

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Error sending PDF email to " + to + ": " + e.getMessage());
        }
    }
//    public void sendNoTransactionEmail(Account account) {
//        String msg = "📭 No new transactions occurred on your account "
//                + account.getAccountNumber() + " from 15th of last month till now.";
//        sendEmail(account.getUser().getEmailId(), "No New Transactions", msg);
//    }

    public void sendNoTransactionEmail(Account account) {
        String subject = "Monthly Statement - No Transactions";

        String body = "<p>Dear " + account.getUser().getFullName() + ",</p>"
                + "<p>We hope you're doing well.</p>"
                + "<p>There have been <strong>no transactions</strong> on your account (<strong>" + account.getAccountNumber() + "</strong>) "
                + "between <strong>" + getStatementStartDate() + "</strong> and <strong>" + getStatementEndDate() + "</strong>.</p>"
                + "<p>Thank you for banking with us.</p>"
                + "<p>Best regards,<br>Your Bank Team</p>";

        sendEmail(account.getUser().getEmailId(), subject, body);
    }
    private String getStatementStartDate() {
        return LocalDate.now().minusMonths(1).withDayOfMonth(15).toString();
    }

    private String getStatementEndDate() {
        return LocalDate.now().toString();
    }

    public byte[] generatePdf(Account account, List<Transaction> transactions) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 90, 36);

        try {
            PdfWriter writer = PdfWriter.getInstance(document, byteArrayOutputStream);
            document.open();

            // Fonts
            Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD, Color.WHITE);
            Font labelFont = new Font(Font.HELVETICA, 11, Font.BOLD);
            Font regularFont = new Font(Font.HELVETICA, 11);
            Font summaryFont = new Font(Font.HELVETICA, 12, Font.BOLD);

            // Title
            Paragraph title = new Paragraph("Monthly Transaction Statement", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10);
            document.add(title);

            // Statement Date
            Paragraph period = new Paragraph("Statement Period: " +
                    YearMonth.now().minusMonths(1).atDay(1).format(DateTimeFormatter.ofPattern("dd MMM yyyy")) + " to " +
                    YearMonth.now().minusMonths(1).atEndOfMonth().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                    regularFont);
            period.setAlignment(Element.ALIGN_CENTER);
            period.setSpacingAfter(20);
            document.add(period);

            // Account Info
            PdfPTable accountTable = new PdfPTable(2);
            accountTable.setWidthPercentage(100);
            accountTable.setWidths(new int[]{2, 5});
            accountTable.setSpacingAfter(15);

            accountTable.addCell(getAccountCell("Account Holder:", labelFont));
            accountTable.addCell(getAccountCell(account.getUser().getFullName(), regularFont));
            accountTable.addCell(getAccountCell("Account Number:", labelFont));
            accountTable.addCell(getAccountCell(account.getAccountNumber(), regularFont));
            accountTable.addCell(getAccountCell("Email:", labelFont));
            accountTable.addCell(getAccountCell(account.getUser().getEmailId(), regularFont));
            accountTable.addCell(getAccountCell("Generated On:", labelFont));
            accountTable.addCell(getAccountCell(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), regularFont));

            document.add(accountTable);

            // Transaction Table
            PdfPTable txnTable = new PdfPTable(6);
            txnTable.setWidthPercentage(100);
            txnTable.setSpacingBefore(10);
            txnTable.setSpacingAfter(10);
            txnTable.setWidths(new float[]{3.5f, 6f, 2.5f, 2.5f, 2.5f, 4.5f});
            txnTable.setHeaderRows(1);

            Stream.of("Date & Time", "Description", "Type", "Amount", "Status", "Txn Reference")
                    .forEach(col -> {
                        PdfPCell cell = new PdfPCell(new Phrase(col, headerFont));
                        cell.setBackgroundColor(new Color(70, 130, 180)); // Steel blue
                        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                        cell.setPadding(6f);
                        txnTable.addCell(cell);
                    });

            BigDecimal totalCredit = BigDecimal.ZERO;
            BigDecimal totalDebit = BigDecimal.ZERO;

            for (Transaction txn : transactions) {
                String type = txn.getTxnType().toString();
                BigDecimal amount = txn.getAmount();

                txnTable.addCell(getTxnCell(txn.getTxnTime().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")), regularFont));
                txnTable.addCell(getTxnCell(txn.getRemarks() != null ? txn.getRemarks() : "-", regularFont));
                txnTable.addCell(getTxnCell(type, regularFont));
                txnTable.addCell(getTxnCell("₹" + formatAmount(amount), regularFont));
                txnTable.addCell(getTxnCell(txn.getStatus().toString(), regularFont));
                txnTable.addCell(getTxnCell(txn.getTransactionReferenceId() != null ? txn.getTransactionReferenceId() : "-", regularFont));

                if ("CREDIT".equalsIgnoreCase(type)) {
                    totalCredit = totalCredit.add(amount);
                } else if ("DEBIT".equalsIgnoreCase(type)) {
                    totalDebit = totalDebit.add(amount);
                }
            }

            document.add(txnTable);

            // Summary Table
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(50);
            summaryTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.setSpacingBefore(20);
            summaryTable.setWidths(new float[]{4, 4});

            summaryTable.addCell(getSummaryCell("Total Credits:", labelFont));
            summaryTable.addCell(getSummaryCell("₹" + formatAmount(totalCredit), regularFont));

            summaryTable.addCell(getSummaryCell("Total Debits:", labelFont));
            summaryTable.addCell(getSummaryCell("₹" + formatAmount(totalDebit), regularFont));

            summaryTable.addCell(getSummaryCell("Closing Balance:", labelFont));
            summaryTable.addCell(getSummaryCell("₹" + formatAmount(account.getBalance()), summaryFont));

            document.add(summaryTable);

            document.close();
        } catch (Exception e) {
            log.error("Error generating PDF: ", e);
        }

        return byteArrayOutputStream.toByteArray();
    }


    private String formatAmount(BigDecimal amount) {
        return String.format("%,.2f", amount);
    }

    private PdfPCell getAccountCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(5f);
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }

    private PdfPCell getTxnCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(5f);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        return cell;
    }

    private PdfPCell getSummaryCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(6f);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        return cell;
    }
}
