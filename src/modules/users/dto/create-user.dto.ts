import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../domain/value-objects/user-role.vo';

export class CreateUserDto {
  @ApiProperty({ example: 'new.user@local.test' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'New User' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CLIENT })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({ example: 'changeme' })
  @IsString()
  @MinLength(1)
  password!: string;
}
