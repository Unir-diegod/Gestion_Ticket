import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/value-objects/user-role.vo';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;
}
