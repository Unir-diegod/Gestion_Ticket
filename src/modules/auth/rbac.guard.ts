import { Injectable } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';

@Injectable()
export class RbacGuard extends RolesGuard {}
