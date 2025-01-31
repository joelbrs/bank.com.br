package br.com.joelf.mstransaction.infrastructure.adapters;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.joelf.mstransaction.application.ports.TokenHandler;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;

public class TokenHandlerImpl implements TokenHandler<Object> {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final String jwtSecret;
    private final Long jwtExpiration;

    public TokenHandlerImpl(String jwtSecret, Long jwtExpiration) {
        this.jwtSecret = jwtSecret;
        this.jwtExpiration = jwtExpiration;
    }

    @Override
    public String generateToken(String issuer, String subject, Object claims) {
        Map<String, Object> claimsMap = MAPPER.convertValue(claims, Map.class);

        return Jwts.builder()
            .issuer(issuer)
            .subject(subject)
            .claims(claimsMap)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(getSigningKey())
            .compact();
    }

    private SecretKey getSigningKey() {
        return new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    @Override
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey()) 
                .build()
                .parseSignedClaims(token);

            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
