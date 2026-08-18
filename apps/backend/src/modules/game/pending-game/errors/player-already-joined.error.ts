export class PlayerAlreadyJoinedError extends Error {
  constructor() {
    super('Player already joined');
    this.name = 'PlayerAlreadyJoinedError';
  }
}
