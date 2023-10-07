import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Menu } from './menu.entity';

@Entity('flavor')
export class FlavorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // @ManyToMany((type) => Menu, (menu) => menu.flavor)
  // coffees: Menu[];
}
