package br.com.joelf.msauthentication.infrastructure.clients.domain.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TokenResponse(
    @JsonProperty("access_token")
    String accessToken,

    @JsonProperty("expires_in")
    Long expiresIn,

    @JsonProperty("refresh_expires_in")
    Long refreshExpiresIn,

    @JsonProperty("refresh_token")
    String refreshToken,

    @JsonProperty("token_type")
    String tokenType,

    @JsonProperty("not-before-policy")
    Long notBeforePolicy,

    @JsonProperty("session_state")
    String sessionState,

    @JsonProperty("id_token")
    String idToken
) {}
