package br.com.joelf.msauthentication.application.services;

import br.com.joelf.msauthentication.domain.entities.Token;
import br.com.joelf.msauthentication.domain.entities.User;
import br.com.joelf.msauthentication.domain.services.AuthService;
import br.com.joelf.msauthentication.infrastructure.repository.AuthRepository;

public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;

    public AuthServiceImpl(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    @Override
    public Token getToken(String username, String password) {
        try {
            return authRepository.getToken(username, password);
        } catch (Exception e) {
            //TODO: handle it properly
            throw e;
        }
    }

    @Override
    public void createUser(User user) {
        try {
            authRepository.createUser(user);
        } catch (Exception e) {
            throw e;
        }
    }
}
