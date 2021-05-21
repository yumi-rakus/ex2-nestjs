import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UsersEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  age: number;
}
