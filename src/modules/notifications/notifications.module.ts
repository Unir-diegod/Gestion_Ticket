import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { NotificationsService } from './notifications.service';
import { WsGateway } from './ws.gateway';

@Module({
  imports: [PersistenceModule.register()],
  providers: [NotificationsService, WsGateway],
  exports: [NotificationsService],
})
export class NotificationsModule {}
