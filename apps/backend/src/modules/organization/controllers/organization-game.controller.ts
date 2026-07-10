import { RequireOrganizationRoles } from '@/modules/organization/decorators/require-organization-roles.decorator';
import { OrganizationRoleCode } from '@/common/enums/organization.role.enum';
import { Body, Controller, Param, ParseUUIDPipe, Post, Req } from '@nestjs/common';
import { GameService } from '@/modules/game/game.service';
import { CreateGameDto } from '@/modules/game/dto/create-game.dto';
import type { JwtRequest } from '@/modules/auth/interfaces/jwt.request.interface';

@Controller('organizations/:organizationId/games')
export class OrganizationGameController {
  constructor(private readonly gameService: GameService) {
  }

  @RequireOrganizationRoles(
    OrganizationRoleCode.ORGANIZATION_ADMIN,
  )
  @Post()
  create(
    @Param('organizationId', ParseUUIDPipe)
    organizationId: string,

    @Body()
    createGameDto: CreateGameDto,

    @Req() req: JwtRequest,
  ) {
    return this.gameService.create({
        dto: createGameDto,
        organizationId,
        createdBy: req.user.id,
      }
    );
  }
}
