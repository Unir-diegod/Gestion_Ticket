import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { HistoryService } from './history.service';

@Module({
  imports: [PersistenceModule.register()],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
