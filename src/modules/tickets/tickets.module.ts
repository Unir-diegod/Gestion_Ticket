import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [PersistenceModule.register()],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
