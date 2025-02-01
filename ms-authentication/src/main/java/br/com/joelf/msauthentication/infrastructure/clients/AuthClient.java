package br.com.joelf.msauthentication.infrastructure.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import br.com.joelf.msauthentication.infrastructure.clients.config.AuthClientConfig;
import br.com.joelf.msauthentication.infrastructure.clients.domain.request.CreateUserRequest;
import br.com.joelf.msauthentication.infrastructure.clients.domain.request.TokenRequest;
import br.com.joelf.msauthentication.infrastructure.clients.domain.response.TokenResponse;

@FeignClient(
    name = "keycloak-client",
    url = "${gateway.url}",
    configuration = AuthClientConfig.class
)
public interface AuthClient {
    
    @PostMapping(value =  "/realms/{realm}/protocol/openid-connect/token", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public TokenResponse getToken(@PathVariable String realm, @RequestBody TokenRequest tokenRequest);

    @PostMapping("/admin/realms/{realm}/users")
    public void createUser(@PathVariable String realm, @RequestBody CreateUserRequest createUserRequest, @RequestHeader("Authorization") String token);
}
