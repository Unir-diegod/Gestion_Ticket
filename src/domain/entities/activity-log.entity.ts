export class ActivityLog {
  constructor(
    public readonly id: number,
    public readonly ticketId: number,
    public readonly action: string,
    public readonly performedByUserId: number,
    public readonly createdAt: Date,
    public readonly metadata?: Record<string, unknown>,
  ) {
    if (!action || action.trim().length < 1) {
      throw new Error('Invalid activity action');
    }
  }
}
