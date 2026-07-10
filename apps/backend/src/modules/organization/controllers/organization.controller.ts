import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { OrganizationService } from '../organization.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { RequireGlobalRoles } from '@/modules/auth/decorators/require-global-roles.decorator';
import { RoleCode } from '@/common/enums/role.enum';

@RequireGlobalRoles(RoleCode.PLATFORM_ADMIN)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':organizationId')
  findOne(
    @Param('organizationId', ParseUUIDPipe)
    organizationId: string,
  ) {
    return this.organizationService.findOne(organizationId);
  }

  @Patch(':organizationId')
  update(@Param('organizationId', ParseUUIDPipe) organizationId: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationService.update(organizationId, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('organizationId', ParseUUIDPipe) organizationId: string) {
    return this.organizationService.remove(organizationId);
  }
}
