# Define o nome dos arquivos docker-compose
DOCKER_COMPOSE_ROOT=docker-compose.yml
DOCKER_COMPOSE_MS_TRANSACTION=ms-transaction/docker-compose.yml
# Define a rede do RabbitMQ
NETWORK_NAME=rabbitmq_network

# Define o comando padrão para subir o projeto
up:
	docker compose -f $(DOCKER_COMPOSE_ROOT) -f $(DOCKER_COMPOSE_MS_TRANSACTION) up --build

# Para parar os containers
down:
	docker compose -f $(DOCKER_COMPOSE_ROOT) -f $(DOCKER_COMPOSE_MS_TRANSACTION) down

# Para parar os containers e remover volumes
down-all:
	docker compose -f $(DOCKER_COMPOSE_ROOT) -f $(DOCKER_COMPOSE_MS_TRANSACTION) down -v

# Para construir as imagens
build:
	docker compose -f $(DOCKER_COMPOSE_ROOT) -f $(DOCKER_COMPOSE_MS_TRANSACTION) build

# Para verificar o status dos containers
ps:
	docker compose -f $(DOCKER_COMPOSE_ROOT) -f $(DOCKER_COMPOSE_MS_TRANSACTION) ps

# Para visualizar os logs
logs:
	docker compose -f $(DOCKER_COMPOSE_ROOT) -f $(DOCKER_COMPOSE_MS_TRANSACTION) logs -f
