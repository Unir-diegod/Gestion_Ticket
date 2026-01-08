import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ActivityLogOrmEntity } from './entities/activity-log.orm-entity';
import { AttachmentOrmEntity } from './entities/attachment.orm-entity';
import { CommentOrmEntity } from './entities/comment.orm-entity';
import { DomainEventOrmEntity } from './entities/domain-event.orm-entity';
import { NotificationOrmEntity } from './entities/notification.orm-entity';
import { RoleOrmEntity } from './entities/role.orm-entity';
import { TicketOrmEntity } from './entities/ticket.orm-entity';
import { UserOrmEntity } from './entities/user.orm-entity';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
  migrations: ['src/infra/database/typeorm/migrations/*.{ts,cts}', 'dist/infra/database/typeorm/migrations/*.{js,cjs}'],
  synchronize: false,
});
