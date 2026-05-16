# Эрмитаж — Музейный API

REST/GraphQL API для управления выставочной деятельностью музея. Приложение позволяет посетителям просматривать выставки, покупать билеты и оставлять отзывы.

**Deployed on Render:** https://agathaakiriyok.onrender.com

---

## Описание

Полнофункциональная система управления музеем с возможностью:
- Просмотра актуальных выставок по залам
- Покупки билетов на выставки
- Управления заказами и историей покупок
- Оставления отзывов о посещении

Система построена на архитектуре REST API с поддержкой GraphQL, использует PostgreSQL для хранения данных и Firebase для аутентификации.

---

## Функциональные требования

### Аутентификация и пользователи
- Регистрация и вход через Firebase Authentication
- Session-based аутентификация с cookies
- Управление профилем пользователя
- Роли: USER и ADMIN

### Управление залами (Halls)
- Просмотр всех залов музея
- Информация о вместимости каждого зала
- Связь залов с выставками

### Выставки (Exhibitions)
- Просмотр текущих и будущих выставок
- Фильтрация по залам и датам
- Получение подробной информации о выставке
- Управление датами проведения

### Заказы и билеты (Orders)
- Создание заказов (покупка билетов)
- Управление статусом заказа (PENDING, PAID, CANCELLED)
- Просмотр истории заказов
- Расчёт стоимости билетов
- Управление позициями в заказе

### Отзывы (Feedback)
- Создание отзывов о выставках
- Просмотр всех отзывов
- Управление собственными отзывами

### API Документация
- Swagger UI с интерактивной документацией
- GraphQL API для альтернативных запросов
- Примеры использования всех эндпоинтов

---

##  Нефункциональные требования

### Производительность
- Кэширование данных через Cache Manager
- ETag поддержка для оптимизации передачи данных
- Отслеживание времени отклика (Timing Interceptor)
- GraphQL Query Complexity анализ для защиты от перегрузки

### Безопасность
- CORS поддержка с конфигурируемыми источниками
- Валидация входных данных (class-validator)
- HTTPS поддержка через reverse proxy
- Защита от SQL-инъекций через Prisma ORM
- Session security через connect-pg-simple
- Хеширование паролей (bcrypt)

### Масштабируемость
- PostgreSQL база данных
- Prisma миграции для версионирования БД
- Модульная архитектура NestJS
- Поддержка сессий в PostgreSQL

## Установка и запуск

### Предварительные требования
- Node.js 22.x
- npm или yarn
- PostgreSQL база данных
- Firebase проект (для аутентификации)

### Шаг 1: Клонирование репозитория
```bash
git clone <repository-url>
cd m3313-kiriyok-back
```

### Шаг 2: Установка зависимостей
```bash
npm install
```

### Шаг 3: Настройка переменных окружения

Создайте файл `.env` в корне проекта:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/museum_db

# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGIN=http://localhost:3000

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# AWS S3 (if needed)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Шаг 4: Подготовка базы данных

```bash
# Генерирование Prisma клиента
npx prisma generate

# Применение миграций
npx prisma migrate deploy

# Заполнение тестовыми данными (опционально)
npx prisma db seed
```

### Шаг 5: Запуск приложения

**Режим разработки** (с автоперезагрузкой):
```bash
npm run start:dev
```

**Режим отладки**:
```bash
npm run start:debug
```

**Production режим**:
```bash
npm run build
npm run start:prod
```

### Проверка работы

- API будет доступен по адресу: `http://localhost:3000`
- Swagger документация: `http://localhost:3000/api/docs`
- GraphQL playground: `http://localhost:3000/graphql` (если включено)

---

## Структура проекта

```
src/
├── auth/              # Аутентификация и авторизация
├── user/              # Управление пользователями
├── hall/              # Управление залами
├── exhibition/        # Управление выставками
├── order/             # Управление заказами
├── feedback/          # Управление отзывами
├── common/            # Общие фильтры, интерсепторы, декораторы
├── app.module.ts      # Основной модуль приложения
└── main.ts            # Entry point

prisma/
├── schema.prisma      # Схема базы данных
└── migrations/        # История миграций


---

##  API Endpoints

### Аутентификация
- `POST /auth/login` — Вход пользователя
- `POST /auth/logout` — Выход из системы
- `POST /auth/register` — Регистрация

### Пользователи
- `GET /users/profile` — Информация профиля
- `PUT /users/profile` — Обновление профиля

### Залы
- `GET /halls` — Список всех залов
- `GET /halls/:id` — Информация о зале

### Выставки
- `GET /exhibitions` — Список выставок
- `GET /exhibitions/:id` — Детали выставки
- `POST /exhibitions` — Создание выставки (ADMIN)
- `PATCH /exhibitions/:id` — Обновление выставки (ADMIN)
- `DELETE /exhibitions/:id` — Удаление выставки (ADMIN)

### Заказы
- `GET /orders` — История заказов пользователя
- `POST /orders` — Создание заказа
- `GET /orders/:id` — Детали заказа
- `PATCH /orders/:id` — Обновление статуса заказа

### Отзывы
- `GET /feedback` — Список отзывов
- `POST /feedback` — Создание отзыва
- `DELETE /feedback/:id` — Удаление отзыва

---

## Скрипты разработки

```bash
npm run build          # Сборка проекта
npm run format         # Форматирование кода (Prettier)
npm run lint           # Проверка кода (ESLint)
npm run postinstall    # Генерирование Prisma клиента (автоматически)
```

---

## Модель данных

```
User
  ├── orders (Order[])
  └── feedbacks (Feedback[])

Order
  ├── user (User)
  └── items (OrderItem[])

OrderItem
  ├── order (Order)
  ├── exhibition (Exhibition)
  └── hall (Hall)

Exhibition
  ├── hall (Hall)
  └── orderItems (OrderItem[])

Hall
  ├── exhibitions (Exhibition[])
  └── orderItems (OrderItem[])

Feedback
  └── user (User)
```
