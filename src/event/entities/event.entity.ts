import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

//索引 可以加载类上（多个），也可以加载属性上（单个）
@Index(['name', 'type'])
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column('json')
  payload: Record<string, any>;
}
