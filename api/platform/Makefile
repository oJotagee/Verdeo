.PHONY: up up-dev down clean logs migrate seed ps

up:
	docker compose -f docker-compose.yml up -d --build

up-dev:
	docker compose -f docker-compose.dev.yml up -d

down:
	docker compose -f docker-compose.yml down

down-dev:
	docker compose -f docker-compose.dev.yml down

clean:
	docker compose -f docker-compose.yml down -v --remove-orphans

logs:
	docker compose -f docker-compose.yml logs -f

migrate:
	docker compose -f docker-compose.yml exec user-api npx prisma migrate deploy

seed:
	docker compose -f docker-compose.yml exec user-api yarn prisma:seed

ps:
	docker compose -f docker-compose.yml ps