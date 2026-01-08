import { User } from '../../../domain/entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: String(user.id),
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
