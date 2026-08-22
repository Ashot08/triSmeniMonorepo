# Многопользовательская игровая платформа для тестирования знаний

# Backend

NestJS API: PostgreSQL, Redis, MinIO (S3), JWT, WebSocket, BullMQ и Swagger.

## Стек

| Слой | Технология |
|------|------------|
| Runtime | NestJS 11, TypeScript 5.7 |
| БД | PostgreSQL 16, TypeORM 0.3 |
| Кэш / очереди / сокеты | Redis 7, BullMQ, Socket.IO + Redis adapter |
| Файлы | MinIO (S3 API, AWS SDK) |
| Auth | Passport JWT / Local, bcrypt |
| API | Swagger (`@nestjs/swagger`) |
| Прочее | Config, Throttler, Pino, class-validator |

## Инфраструктура (Docker Compose)

Сервисы из `docker/docker-compose.yml`:

| Сервис | Образ | Порты | Назначение |
|--------|--------|-------|------------|
| `postgres` | `postgres:16-alpine` | `5432` | Основная БД |
| `redis` | `redis:7-alpine` | `6379` | Кэш, очереди, адаптер сокетов |
| `minio` | `minio/minio:latest` | `9000` (S3), `9001` (консоль) | Объектное хранилище |

Все три сервиса с `restart: unless-stopped` и именованными томами: `postgres_data`, `redis_data`, `minio_data`.

У Postgres и Redis есть healthcheck (`pg_isready` / `redis-cli ping`).

### Переменные окружения (значения по умолчанию)

```env
POSTGRES_USER=ts_user
POSTGRES_PASSWORD=ts_pass
POSTGRES_DB=ts_game

REDIS_PASSWORD=redis_pass

MINIO_ROOT_USER=minio_admin
MINIO_ROOT_PASSWORD=minio_pass
```

### Запуск инфраструктуры

```bash
docker compose -f docker/docker-compose.yml up -d
```

Консоль MinIO: http://localhost:9001

## Скрипты

```bash
npm run start:dev      # разработка с watch
npm run start:debug    # debug + watch
npm run start:prod     # production (node dist/main)
npm run build
npm run lint
npm run format
npm run typecheck
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e       # сейчас заглушка (skipped)
```

### Миграции TypeORM

```bash
npm run migration:create    # пустой файл миграции
npm run migration:generate  # сгенерировать по diff схемы
npm run migration:run
npm run migration:revert
```

Datasource: `src/database/data-source.ts`.

## Быстрый старт

1. Поднять Postgres, Redis и MinIO (команда выше).
2. Задать `.env` (как минимум те же креды, что в compose).
3. `npm install`
4. `npm run migration:run`
5. `npm run start:dev`

## Зависимости (по смыслу)

- **HTTP / WS:** Express, Socket.IO, Redis adapter
- **Данные:** `pg`, TypeORM, Nest TypeORM
- **Кэш:** `cache-manager`, `cache-manager-redis-yet`, `ioredis`, `redis`
- **Очереди:** `@nestjs/bullmq`, `bullmq`
- **S3:** `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
- **Безопасность:** JWT, Passport, Throttler, bcrypt
- **Логи:** nestjs-pino, pino, pino-pretty
