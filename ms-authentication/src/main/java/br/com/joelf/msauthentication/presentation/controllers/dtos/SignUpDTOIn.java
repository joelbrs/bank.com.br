package br.com.joelf.msauthentication.presentation.controllers.dtos;

import br.com.joelf.msauthentication.domain.entities.User;

public record SignUpDTOIn (
    String password,
    String email,
    String firstName,
    String lastName,
    String taxId
) {
    public User toEntity() {
        return new User(
            this.password(),
            this.email(),
            this.firstName(),
            this.lastName(),
            this.taxId()
        );
    }
}
