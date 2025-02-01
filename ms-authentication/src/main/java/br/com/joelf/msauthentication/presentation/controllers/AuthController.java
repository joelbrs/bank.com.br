package br.com.joelf.msauthentication.presentation.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.joelf.msauthentication.domain.entities.Token;
import br.com.joelf.msauthentication.domain.services.AuthService;
import br.com.joelf.msauthentication.presentation.controllers.dtos.SignInDTOIn;
import br.com.joelf.msauthentication.presentation.controllers.dtos.SignUpDTOIn;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<Void> signUp(
        @RequestBody SignUpDTOIn dto
    ) {
        authService.createUser(dto.toEntity());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/sign-in")
    public ResponseEntity<Token> signIn(
        @RequestBody SignInDTOIn dto
    ) {
        Token token = authService.getToken(dto.taxId(), dto.password());
        return ResponseEntity.status(HttpStatus.OK).body(token);
    }
}
