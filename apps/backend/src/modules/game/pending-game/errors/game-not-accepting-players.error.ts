export class GameNotAcceptingPlayersError extends Error {
  constructor() {
    super('Game is not accepting players');
    this.name = 'GameNotAcceptingPlayersError';
  }
}
