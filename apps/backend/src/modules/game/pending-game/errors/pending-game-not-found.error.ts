export class PendingGameNotFoundError extends Error {
  constructor() {
    super('Pending game not found');
    this.name = 'PendingGameNotFoundError';
  }
}
