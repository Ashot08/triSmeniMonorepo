import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64, nullable: false })
  code!: string;

  @Column({ type: 'varchar', length: 128, nullable: false })
  name!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
