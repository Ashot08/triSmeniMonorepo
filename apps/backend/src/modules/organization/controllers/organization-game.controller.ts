import { RequireOrganizationRoles } from '../decorators/require-organization-roles.decorator';
import { OrganizationRoleCode } from '@/common/enums/organization.role.enum';
import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateGameDto } from '@/modules/game/dto/create-game.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { CreateGameUseCase } from '@/modules/game/application/create-game.use-case';
import { CurrentOrganizationContext } from '../decorators/current-organization-context.decorator';
import { type OrganizationContext } from '@/modules/auth/interfaces/jwt.request.interface';

@Controller('organizations/:organizationId/games')
export class OrganizationGameController {
  constructor(
    private readonly createGameUseCase: CreateGameUseCase,
  ) {
  }

  @RequireOrganizationRoles(
    OrganizationRoleCode.ORGANIZATION_ADMIN,
  )
  @Post()
  create(
    @Param('organizationId', ParseUUIDPipe)
    organizationId: string,

    @Body()
    dto: CreateGameDto,

    @CurrentUser() user: JwtUser,

    @CurrentOrganizationContext()
    organizationContext: OrganizationContext,
  ) {
    return this.createGameUseCase.execute({
      dto,
      organizationId,
      organizationRoles: organizationContext.roles,
      user,
    });
  }
}
