import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './controllers/organization.controller';
import { Organization } from './entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationDepartment } from './entities/organization-department.entity';
import { OrganizationMembership } from './entities/organization-membership.entity';
import { OrganizationRole } from '@/modules/organization/entities/organization-role.entity';
import { GameModule } from '@/modules/game/game.module';
import { OrganizationGameController } from './controllers/organization-game.controller';
import { OrganizationMembershipService } from '@/modules/organization/organization-membership.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Organization,
    OrganizationDepartment,
    OrganizationMembership,
    OrganizationRole
  ]), GameModule],
  controllers: [OrganizationController, OrganizationGameController],
  providers: [OrganizationService, OrganizationMembershipService],
})
export class OrganizationModule {}
