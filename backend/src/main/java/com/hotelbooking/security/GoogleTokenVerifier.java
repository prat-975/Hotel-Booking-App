package com.hotelbooking.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotelbooking.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GoogleTokenVerifier {

    private static final String TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";

    @Value("${app.google.client-id}")
    private String googleClientId;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GoogleUserInfo verify(String idToken) {
        try {
            String response = restTemplate.getForObject(TOKEN_INFO_URL + idToken, String.class);
            JsonNode node = objectMapper.readTree(response);

            if (node.has("error")) {
                throw new BadRequestException("Invalid Google token");
            }

            String aud = node.get("aud").asText();
            if (!aud.equals(googleClientId)) {
                throw new BadRequestException("Google token audience mismatch");
            }

            GoogleUserInfo info = new GoogleUserInfo();
            info.setGoogleId(node.get("sub").asText());
            info.setEmail(node.get("email").asText());
            info.setName(node.has("name") ? node.get("name").asText() : node.get("email").asText());
            info.setPicture(node.has("picture") ? node.get("picture").asText() : null);
            info.setEmailVerified(node.has("email_verified") && node.get("email_verified").asBoolean());

            if (!info.isEmailVerified()) {
                throw new BadRequestException("Google email is not verified");
            }

            return info;
        } catch (BadRequestException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BadRequestException("Failed to verify Google token");
        }
    }

    public static class GoogleUserInfo {
        private String googleId;
        private String email;
        private String name;
        private String picture;
        private boolean emailVerified;

        public String getGoogleId() {
            return googleId;
        }

        public void setGoogleId(String googleId) {
            this.googleId = googleId;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getPicture() {
            return picture;
        }

        public void setPicture(String picture) {
            this.picture = picture;
        }

        public boolean isEmailVerified() {
            return emailVerified;
        }

        public void setEmailVerified(boolean emailVerified) {
            this.emailVerified = emailVerified;
        }
    }
}
