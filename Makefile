SPRING_PROFILES_ACTIVE ?= default
APP_AUTH_ENABLED ?= true
VITE_AUTH_ENABLED ?= false
FRONTEND_PORT ?= 80
BACKEND_PORT ?= 8080
DB_PORT ?= 5432

export

.PHONY: up down dev logs rebuild

up:
	docker compose up -d

dev:
	SPRING_PROFILES_ACTIVE=dev APP_AUTH_ENABLED=false docker compose up -d

down:
	docker compose down

rebuild:
	docker compose up -d --build

logs:
	docker compose logs -f

logs-be:
	docker compose logs -f backend

logs-fe:
	docker compose logs -f frontend