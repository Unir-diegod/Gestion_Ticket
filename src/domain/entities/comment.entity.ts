export class Comment {
  constructor(
    public readonly id: number,
    public readonly ticketId: number,
    public readonly authorUserId: number,
    public readonly message: string,
    public readonly createdAt: Date,
  ) {
    if (!message || message.trim().length < 1) {
      throw new Error('Invalid comment message');
    }
  }
}
