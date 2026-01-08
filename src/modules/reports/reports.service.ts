import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  async getHealthSummary() {
    return {
      status: 'ok',
      note: 'Reports stub (sin queries, sin full-text, sin DB)',
    };
  }
}
