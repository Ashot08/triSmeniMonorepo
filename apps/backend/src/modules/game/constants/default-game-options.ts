import { GameQuestionsType } from '@/modules/game/enums/game-questions-type.enum';

export const defaultGameOptions = {
  SHIFTS_COUNT: 3,
  STARTING_COINS: 10,
  WORKERS_PER_PLAYER: 6,
  ANSWER_TIMEOUT_SECONDS: 25,
  IS_RECORDED_TO_STATISTICS: true,
  QUESTIONS_TYPE: GameQuestionsType.PLATFORM,
};
