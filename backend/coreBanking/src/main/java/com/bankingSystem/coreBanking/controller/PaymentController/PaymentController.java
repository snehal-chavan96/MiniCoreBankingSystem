package com.bankingSystem.coreBanking.controller.PaymentController;

import com.bankingSystem.coreBanking.Service.PayService.PayService;
import com.razorpay.RazorpayException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PayService razorpayService;

    @PostMapping("/create-order")
    public String createOrder(@RequestParam int amount, @RequestParam String currency){
        logger.info("Received createOrder request with amount: {} and currency: {}", amount, currency);
        try {
            String orderId = razorpayService.createOrder(amount, currency, "recipient_100");
            logger.info("Order created successfully with orderId: {}", orderId);
            return orderId;
        } catch (RazorpayException e) {
            logger.error("Error creating order with amount: {} and currency: {}", amount, currency, e);
            throw new RuntimeException(e);
        }
    }
}
