import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InMemoryHistoryRepository } from './in-memory/in-memory-history.repository';
import { InMemoryTicketRepository } from './in-memory/in-memory-ticket.repository';
import { InMemoryUserRepository } from './in-memory/in-memory-user.repository';
import { InMemoryNotificationRepository } from './in-memory/in-memory-notification.repository';
import { HISTORY_REPOSITORY } from '../../interfaces/repositories/history.repository';
import { NOTIFICATION_REPOSITORY } from '../../interfaces/repositories/notification.repository';
import { TICKET_REPOSITORY } from '../../interfaces/repositories/ticket.repository';
import { USER_REPOSITORY } from '../../interfaces/repositories/user.repository';
import { ActivityLogOrmEntity } from '../../infra/database/typeorm/entities/activity-log.orm-entity';
import { AttachmentOrmEntity } from '../../infra/database/typeorm/entities/attachment.orm-entity';
import { CommentOrmEntity } from '../../infra/database/typeorm/entities/comment.orm-entity';
import { DomainEventOrmEntity } from '../../infra/database/typeorm/entities/domain-event.orm-entity';
import { NotificationOrmEntity } from '../../infra/database/typeorm/entities/notification.orm-entity';
import { RoleOrmEntity } from '../../infra/database/typeorm/entities/role.orm-entity';
import { TicketOrmEntity } from '../../infra/database/typeorm/entities/ticket.orm-entity';
import { UserOrmEntity } from '../../infra/database/typeorm/entities/user.orm-entity';
import { MysqlHistoryRepository } from '../../infra/database/typeorm/repositories/mysql-history.repository';
import { MysqlNotificationRepository } from '../../infra/database/typeorm/repositories/mysql-notification.repository';
import { MysqlTicketRepository } from '../../infra/database/typeorm/repositories/mysql-ticket.repository';
import { MysqlUserRepository } from '../../infra/database/typeorm/repositories/mysql-user.repository';

@Module({})
export class PersistenceModule {
  static register(): DynamicModule {
    const driver = process.env.PERSISTENCE_DRIVER ?? 'in-memory';
    const useMysql = driver === 'mysql';

    if (!useMysql) {
      return {
        module: PersistenceModule,
        providers: [
          { provide: USER_REPOSITORY, useClass: InMemoryUserRepository },
          { provide: TICKET_REPOSITORY, useClass: InMemoryTicketRepository },
          { provide: HISTORY_REPOSITORY, useClass: InMemoryHistoryRepository },
          { provide: NOTIFICATION_REPOSITORY, useClass: InMemoryNotificationRepository },
        ],
        exports: [USER_REPOSITORY, TICKET_REPOSITORY, HISTORY_REPOSITORY, NOTIFICATION_REPOSITORY],
      };
    }

    return {
      module: PersistenceModule,
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: 'mysql',
            host: config.getOrThrow<string>('DB_HOST'),
            port: config.getOrThrow<number>('DB_PORT'),
            username: config.getOrThrow<string>('DB_USER'),
            password: config.getOrThrow<string>('DB_PASSWORD'),
            database: config.getOrThrow<string>('DB_NAME'),
            entities: [
              UserOrmEntity,
              RoleOrmEntity,
              TicketOrmEntity,
              CommentOrmEntity,
              AttachmentOrmEntity,
              ActivityLogOrmEntity,
              NotificationOrmEntity,
              DomainEventOrmEntity,
            ],
            migrations: [
              'dist/infra/database/typeorm/migrations/*.{js,cjs}',
              'src/infra/database/typeorm/migrations/*.{ts,cts}',
            ],
            synchronize: false,
            logging: config.get<boolean>('DB_LOGGING') ?? false,
          }),
        }),
        TypeOrmModule.forFeature([
          UserOrmEntity,
          RoleOrmEntity,
          TicketOrmEntity,
          CommentOrmEntity,
          AttachmentOrmEntity,
          ActivityLogOrmEntity,
          NotificationOrmEntity,
          DomainEventOrmEntity,
        ]),
      ],
      providers: [
        { provide: USER_REPOSITORY, useClass: MysqlUserRepository },
        { provide: TICKET_REPOSITORY, useClass: MysqlTicketRepository },
        { provide: HISTORY_REPOSITORY, useClass: MysqlHistoryRepository },
        { provide: NOTIFICATION_REPOSITORY, useClass: MysqlNotificationRepository },
      ],
      exports: [USER_REPOSITORY, TICKET_REPOSITORY, HISTORY_REPOSITORY, NOTIFICATION_REPOSITORY],
    };
  }
}
