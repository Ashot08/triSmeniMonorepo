Выделяем отдельный application слой в приложении
Этот слой будет состоять из сервисов, которые отвечают за оркестрацию между модулями - всё, 
что описывает сценарий взаимодействия нескольких модулей, не принадлежит ни одному из них. 
Это и есть задача Application Service (Application Service - он же Use Case). 
Такой подход позволяет каждому модулю оставаться независимым.

Например:

PendingGameController
│
▼
CreateGameApplicationService
│
├── GamePolicyService
├── GameValidationService
├── QuestionService
├── OrganizationService
└── GameService



Пример создания игры организации:

HTTP

↓

JwtGuard

↓

OrganizationMembershipGuard

↓

OrganizationRoleGuard

↓

PendingGameController

↓

CreateGameUseCase --- начало use case и всё дальше вызывается в use case
│
├────────────► GamePolicyService
│
├────────────► GameValidationService
│
├────────────► QuestionService (если нужны вопросы)
│
├────────────► OrganizationService (если нужно что-то получить)
│
├────────────► StatisticsService (если нужно)
│
▼
GameService --- тоже вызывается в use case

↓

Repository --- вызывается в GameService

