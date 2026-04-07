export enum GameStatus {
  /**
   * Создана, ожидание начала и участников
   */
  PENDING = 'PENDING',

  /**
   * Набирает участников (запущена регистрация)
   */
  WAITING_FOR_PLAYERS = 'WAITING_FOR_PLAYERS',

  /**
   * Активная игра идёт
   */
  ACTIVE = 'ACTIVE',

  /**
   * Пауза
   */
  PAUSED = 'PAUSED',

  /**
   * Завершена, идёт подсчёт результатов
   */
  FINISHED = 'FINISHED',

  /**
   * Отменена
   */
  CANCELLED = 'CANCELLED',

  /**
   * Архивирована (старая игра)
   */
  ARCHIVED = 'ARCHIVED',
}
