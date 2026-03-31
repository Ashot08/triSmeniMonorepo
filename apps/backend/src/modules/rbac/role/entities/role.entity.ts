import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Permission } from '@/modules/rbac/permission/entities/permission.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64, nullable: false })
  code!: string;

  @Column({ type: 'varchar', length: 128, nullable: false })
  name!: string;

  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];

  @ManyToMany(() => Permission, (p) => p.roles, { cascade: false })
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions!: Permission[];
}
