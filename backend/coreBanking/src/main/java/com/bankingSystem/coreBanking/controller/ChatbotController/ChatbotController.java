package com.bankingSystem.coreBanking.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private static final String TOGETHER_API_KEY = "09d1b1c97d891bfeec629885a3ac45ef7b67edf7f26a03ad17b30ccb29e8d8f4";
    private static final String TOGETHER_API_URL = "https://api.together.ai/v1/chat/completions";
    private static final String MODEL_NAME = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free";

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public ResponseEntity<Map<String, String>> chatWithLlama(@RequestBody Map<String, String> body) {
        String question = body.get("question");

        try {
            // Create message
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", question != null ? question : ""); // prevent null here

            // Construct request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", MODEL_NAME);
            // System message to guide the model's behavior
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", "You are a helpful banking assistant. Keep answers short and simple (max 3 lines).");

// Include both system and user messages
            requestBody.put("messages", List.of(systemMessage, userMessage));


            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(TOGETHER_API_KEY);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Call Together AI
            ResponseEntity<String> response = restTemplate.postForEntity(TOGETHER_API_URL, entity, String.class);

            // Parse response
            ObjectMapper objectMapper = new ObjectMapper();
            Map<?, ?> json = objectMapper.readValue(response.getBody(), Map.class);
            List<?> choices = (List<?>) json.get("choices");

            String answer = "No response from model.";
            if (choices != null && !choices.isEmpty()) {
                Map<?, ?> choice = (Map<?, ?>) choices.get(0);
                Map<?, ?> message = (Map<?, ?>) choice.get("message");
                answer = message != null ? (String) message.get("content") : answer;
            }

            Map<String, String> result = new HashMap<>();
            result.put("answer", answer);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("answer", "AI service failed. Please try again later."));
        }
    }
}