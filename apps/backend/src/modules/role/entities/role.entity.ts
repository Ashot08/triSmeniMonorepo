import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';

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
}
