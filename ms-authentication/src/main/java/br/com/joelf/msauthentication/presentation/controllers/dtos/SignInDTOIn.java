package br.com.joelf.msauthentication.presentation.controllers.dtos;

public record SignInDTOIn(
    String taxId,
    String password
) {}
