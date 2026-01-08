export class Notification {
  constructor(
    public readonly id: number,
    public readonly type: string,
    public readonly message: string,
    public readonly createdAt: Date,
    public readonly userId?: number,
    public readonly ticketId?: number,
  ) {
    if (!type || type.trim().length < 1) {
      throw new Error('Invalid notification type');
    }
    if (!message || message.trim().length < 1) {
      throw new Error('Invalid notification message');
    }
  }
}
