package br.com.joelf.mstransaction.infrastructure.adapters;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.joelf.mstransaction.application.ports.TokenHandler;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

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

    private Key getSigningKey() {
        byte[] keyBytes = this.jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
