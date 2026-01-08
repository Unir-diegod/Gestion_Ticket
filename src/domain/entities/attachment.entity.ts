export class Attachment {
  constructor(
    public readonly id: number,
    public readonly ticketId: number,
    public readonly filename: string,
    public readonly url: string,
    public readonly uploadedByUserId: number,
    public readonly createdAt: Date,
  ) {
    if (!filename || filename.trim().length < 1) {
      throw new Error('Invalid attachment filename');
    }
    if (!url || url.trim().length < 1) {
      throw new Error('Invalid attachment url');
    }
  }
}
