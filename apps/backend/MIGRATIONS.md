# TypeORM Migrations

## Проблема и решение

В этом монорепозитории стандартная команда `typeorm-ts-node-commonjs` зависает при попытке генерации миграций. Это связано с тем, что эта команда является обёрткой над `npx`, которая пытается каждый раз установить TypeORM через npx, что приводит к зависанию.

**Решение**: Используется прямой вызов TypeORM CLI через `node --require ts-node/register` с путём к модулю из корня монорепозитория.

## Доступные команды

### Генерация миграции
```bash
npm run migration:generate src/database/migrations/<MigrationName>
```
Анализирует изменения в entity-классах и автоматически создаёт миграцию.

Пример:
```bash
npm run migration:generate src/database/migrations/AddUserTable
```

### Создание пустой миграции
```bash
npm run migration:create src/database/migrations/<MigrationName>
```
Создаёт пустой шаблон миграции для ручного редактирования.

### Применение миграций
```bash
npm run migration:run
```
Выполняет все неприменённые миграции.

### Откат миграции
```bash
npm run migration:revert
```
Откатывает последнюю примененную миграцию.

## Структура

- `src/database/data-source.ts` - конфигурация DataSource для TypeORM
- `src/database/entities/` - entity-классы
- `src/database/migrations/` - файлы миграций
- `tsconfig.typeorm.json` - отдельная конфигурация TypeScript с `module: "commonjs"` для совместимости с TypeORM CLI

## Особенности конфигурации

1. **Путь к .env**: DataSource загружает `.env` из корня монорепозитория (2 уровня вверх от `apps/backend`)
2. **Пути к entities**: Используется явный путь `entities/*.entity.{ts,js}` вместо glob-паттерна `**/*.entity.ts`
3. **Команда typeorm**: Использует прямой вызов CLI из корневого `node_modules`:
   ```json
   "typeorm": "cross-env TS_NODE_PROJECT=tsconfig.typeorm.json node --require ts-node/register ../../node_modules/typeorm/cli.js -d src/database/data-source.ts"
   ```

## Почему не работает typeorm-ts-node-commonjs?

Команда `typeorm-ts-node-commonjs` - это обёртка, которая выполняет:
```bash
npx --yes -p typeorm typeorm-ts-node-commonjs "$@"
```

Эта команда пытается установить TypeORM через npx при каждом запуске, что в монорепозитории приводит к бесконечному зависанию. Поэтому мы используем прямой вызов TypeORM CLI.
