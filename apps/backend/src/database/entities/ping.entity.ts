import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ping' })
export class PingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: false })
  message!: string;
}
