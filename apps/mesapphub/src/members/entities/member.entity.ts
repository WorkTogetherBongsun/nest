import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
