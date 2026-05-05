import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Organization } from './entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationDepartment } from './entities/organization-department.entity';
import { OrganizationMembership } from './entities/organization-membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrganizationDepartment, OrganizationMembership])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
