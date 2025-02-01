package br.com.joelf.msauthentication.infrastructure.repository.impl;

import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;

import br.com.joelf.msauthentication.domain.entities.Token;
import br.com.joelf.msauthentication.domain.entities.User;
import br.com.joelf.msauthentication.infrastructure.clients.AuthClient;
import br.com.joelf.msauthentication.infrastructure.clients.domain.request.CreateUserRequest;
import br.com.joelf.msauthentication.infrastructure.clients.domain.request.CredentialRequest;
import br.com.joelf.msauthentication.infrastructure.clients.domain.request.TokenRequest;
import br.com.joelf.msauthentication.infrastructure.clients.domain.request.enums.UserRole;
import br.com.joelf.msauthentication.infrastructure.clients.domain.response.TokenResponse;
import br.com.joelf.msauthentication.infrastructure.repository.AuthRepository;
import feign.FeignException;

public class AuthRepositoryImpl implements AuthRepository {

    private static final ObjectMapper MAPPER = JsonMapper.builder().disable(MapperFeature.USE_ANNOTATIONS).build();
    private static final String CREDENTIAL_TYPE = "password";

    private final String realm;
    private final String clientId;
    private final String clientSecret;
    private final String grantType;

    private final String adminGrantType;

    private AuthClient authClient;

    public AuthRepositoryImpl(String realm, String clientId, String clientSecret, String grantType,
            String adminGrantType, AuthClient authClient) {
        this.realm = realm;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.grantType = grantType;
        this.adminGrantType = adminGrantType;
        this.authClient = authClient;
    }

    @Override
    public Token getToken(String taxId, String password) {
        TokenRequest tokenRequest = new TokenRequest(clientId, grantType, clientSecret, taxId, password);
        try {
            TokenResponse response = authClient.getToken(realm, tokenRequest);
            return MAPPER.convertValue(response, Token.class);
        } catch (FeignException e) {
            //TODO: handle it properly
            throw e;
        }
    }

    @Override
    public void createUser(User user) {
        TokenRequest tokenRequest = 
            new TokenRequest(clientId, adminGrantType, clientSecret, null, null);
        
        try {
            TokenResponse response = authClient.getToken(realm, tokenRequest);
            String accessToken = response.accessToken();
            String authorizationHeader = "Bearer " + accessToken;

            List<UserRole> roles = Collections.singletonList(UserRole.USER);
            CredentialRequest credentials = CredentialRequest.builder()
                .type(CREDENTIAL_TYPE)
                .value(user.getPassword())
                .temporary(Boolean.FALSE)
                .build();

            CreateUserRequest userRequest = CreateUserRequest.builder()
                .taxId(user.getTaxId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .enabled(Boolean.TRUE)
                .emailVerified(Boolean.FALSE)
                .realmRoles(roles)
                .credentials(Collections.singletonList(credentials))
                .build();
            
            authClient.createUser(realm, userRequest, authorizationHeader);
        } catch (FeignException e) {
            //TODO: handle it properly
            throw e;
        }
    }
}
