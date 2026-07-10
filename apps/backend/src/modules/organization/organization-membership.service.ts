import { Injectable } from '@nestjs/common';
import { OrganizationRoleCode } from '@/common/enums/organization.role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationMembership } from './entities/organization-membership.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationMembershipService {
  constructor(@InjectRepository(OrganizationMembership) private readonly membershipRepository: Repository<OrganizationMembership>,) {
  }

  async hasAnyRole(
    userId: string,
    organizationId: string,
    roles: OrganizationRoleCode[],
  ): Promise<boolean> {

    const membership =
      await this.membershipRepository.findOne({
        where: {
          user: {
            id: userId,
          },
          organization: {
            id: organizationId,
          },
        },
        relations: {
          organizationRoles: true,
        },
      });

    if (!membership) {
      return false;
    }

    return membership.organizationRoles.some(role =>
      roles.includes(role.code),
    );
  }
}
