export class GameIsFullError extends Error {
  constructor() {
    super('Game is full');
    this.name = 'GameIsFullError';
  }
}
