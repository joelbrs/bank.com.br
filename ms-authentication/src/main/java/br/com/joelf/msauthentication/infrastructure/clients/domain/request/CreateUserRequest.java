package br.com.joelf.msauthentication.infrastructure.clients.domain.request;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import br.com.joelf.msauthentication.infrastructure.clients.domain.request.enums.UserRole;

public record CreateUserRequest(
    String username,
    String email,
    String firstName,
    String lastName,
    Boolean enabled,
    Boolean emailVerified,
    List<UserRole> realmRoles,
    List<CredentialRequest> credentials,
    Map<String, List<String>> attributes
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private Boolean enabled;
        private Boolean emailVerified;
        private List<UserRole> realmRoles;
        private List<CredentialRequest> credentials;
        private Map<String, List<String>> attributes = new HashMap<>();

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public Builder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public Builder enabled(Boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public Builder emailVerified(Boolean emailVerified) {
            this.emailVerified = emailVerified;
            return this;
        }

        public Builder taxId(String taxId) {
            this.username = taxId;
            this.attributes.put("taxId", Collections.singletonList(taxId));
            return this;
        }

        public Builder realmRoles(List<UserRole> realmRoles) {
            this.realmRoles = realmRoles;
            return this;
        }

        public Builder credentials(List<CredentialRequest> credentials) {
            this.credentials = credentials;
            return this;
        }

        public CreateUserRequest build() {
            return new CreateUserRequest(username, email, firstName, lastName, enabled, emailVerified, realmRoles, credentials, attributes);
        }
    }
}