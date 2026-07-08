import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { RoleCode } from '@/common/enums/role.enum';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64, nullable: false })
  code!: RoleCode;

  @Column({ type: 'varchar', length: 128, nullable: false })
  name!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
