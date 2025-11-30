package com.bankingSystem.coreBanking.controller.ChatbotController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);

    // Your API Key & Constants
    private static final String TOGETHER_API_KEY = "09d1b1c97d891bfeec629885a3ac45ef7b67edf7f26a03ad17b30ccb29e8d8f4";
    private static final String TOGETHER_API_URL = "https://api.together.ai/v1/chat/completions";
    private static final String MODEL_NAME = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free";

    // Prebuilt static system message (no reallocation per request)
    private static final Map<String, String> SYSTEM_MESSAGE = Map.of(
            "role", "system",
            "content", """
                You are a professional, concise AI assistant for an Indian Core Banking System platform.
                Your role is to assist users with general banking queries such as fixed deposits, interest rates, KYC, account types, balance inquiries, and basic banking terms.

                Guidelines:
                - Keep all answers short and helpful (maximum 7 lines).
                - If a question is unclear or unrelated to banking, politely reply: "I'm unable to help with that. Please contact bank support."
                - Do not hallucinate or make up information—only respond with general knowledge or safely worded guidance.
                - Never request personal or sensitive information from the user (e.g., account number, Aadhaar, PIN).
                - If data is not available or the model is unsure, respond with: "I'm not sure about that. Please contact your branch for accurate details."
                """
    );

    @Autowired
    private RestTemplate restTemplate; // Singleton Bean

    @Autowired
    private ObjectMapper objectMapper; // Singleton Bean

    @PostMapping
    public ResponseEntity<Map<String, String>> chatWithLlama(@RequestBody Map<String, String> body) {
        long startTime = System.currentTimeMillis();
        String question = body.getOrDefault("question", "");
        logger.info("Received chat request with question: {}", question);

        try {
            // User message
            Map<String, String> userMessage = Map.of(
                    "role", "user",
                    "content", question
            );

            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", MODEL_NAME);
            requestBody.put("messages", List.of(SYSTEM_MESSAGE, userMessage));
            requestBody.put("max_tokens", 200); // limit output length
            requestBody.put("temperature", 0.7);
            requestBody.put("stream", false); // set true for streaming

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(TOGETHER_API_KEY);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            logger.info("Sending request to Together AI API at {}", TOGETHER_API_URL);

            // Send request
            ResponseEntity<String> response = restTemplate.postForEntity(TOGETHER_API_URL, entity, String.class);

            logger.info("Received response from Together AI API with status: {}", response.getStatusCode());

            // Parse JSON response
            Map<?, ?> json = objectMapper.readValue(response.getBody(), Map.class);
            List<?> choices = (List<?>) json.get("choices");

            String answer = "No response from model.";
            if (choices != null && !choices.isEmpty()) {
                Map<?, ?> choice = (Map<?, ?>) choices.get(0);
                Map<?, ?> message = (Map<?, ?>) choice.get("message");
                if (message != null) {
                    answer = (String) message.get("content");
                }
            }

            logger.info("Model answer: {}", answer);

            // Prepare result
            Map<String, String> result = Map.of("answer", answer);
            long duration = System.currentTimeMillis() - startTime;
            logger.info("Total chatbot response time: {} ms", duration);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            logger.error("Error during chat processing", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("answer", "AI service failed. Please try again later."));
        }
    }
}
