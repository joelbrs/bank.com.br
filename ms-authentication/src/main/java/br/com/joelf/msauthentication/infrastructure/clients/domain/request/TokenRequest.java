package br.com.joelf.msauthentication.infrastructure.clients.domain.request;

import feign.form.FormProperty;

public class TokenRequest {

    @FormProperty("client_id")
    private String clientId;

    @FormProperty("grant_type")
    private String grantType;

    @FormProperty("client_secret")
    private String clientSecret;
    private String username;
    private String password;

    public TokenRequest() {}

    public TokenRequest(String clientId, String grantType, String clientSecret, String username, String password) {
        this.clientId = clientId;
        this.grantType = grantType;
        this.clientSecret = clientSecret;
        this.username = username;
        this.password = password;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getGrantType() {
        return grantType;
    }

    public void setGrantType(String grantType) {
        this.grantType = grantType;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
