import { Module } from '@nestjs/common';
import { PermissionModule } from './permission/permission.module';
import { RoleController } from '@/modules/rbac/role/role.controller';
import { PermissionController } from '@/modules/rbac/permission/permission.controller';
import { RoleService } from '@/modules/rbac/role/role.service';
import { PermissionService } from '@/modules/rbac/permission/permission.service';
import { RoleModule } from '@/modules/rbac/role/role.module';

@Module({
  controllers: [RoleController, PermissionController],
  providers: [RoleService, PermissionService],
  imports: [PermissionModule, RoleModule],
  exports: [RoleService, PermissionService],
})
export class RbacModule {}
