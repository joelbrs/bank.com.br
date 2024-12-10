package br.com.joelf.wstransaction.infraestructure.repositories.https;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "authorizer",
        url = "${authorizer.url",
        path = "${authorizer.path}"
)
public interface AuthorizerClient {

    @GetMapping("/authorize")
    void authorize();
}
