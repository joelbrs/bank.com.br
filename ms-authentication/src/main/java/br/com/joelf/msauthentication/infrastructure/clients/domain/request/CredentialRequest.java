package br.com.joelf.msauthentication.infrastructure.clients.domain.request;

public record CredentialRequest(
    String type,
    String value,
    Boolean temporary
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String type;
        private String value;
        private Boolean temporary;

        public Builder type(String type) {
            this.type = type;
            return this;
        }

        public Builder value(String value) {
            this.value = value;
            return this;
        }

        public Builder temporary(Boolean temporary) {
            this.temporary = temporary;
            return this;
        }

        public CredentialRequest build() {
            return new CredentialRequest(type, value, temporary);
        }
    }
}