package br.com.joelf.mstransaction.infrastructure.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import br.com.joelf.mstransaction.infrastructure.clients.domain.AuthorizerResponse;

@FeignClient(
        name = "authorizer",
        url = "${authorizer.url}",
        path = "${authorizer.path}"
)
public interface AuthorizerClient {

    @GetMapping("/authorize")
    AuthorizerResponse authorize();
}
