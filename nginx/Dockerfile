# Usar uma imagem base do OpenResty
FROM openresty/openresty:alpine

# Instalar dependências necessárias
RUN apk add --no-cache \
    git \
    curl \
    bash \
    jq

# Baixar a chave pública do Keycloak
COPY keycloak.pub /etc/nginx/keys/keycloak.pub

# Copiar o arquivo de configuração do OpenResty
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80
