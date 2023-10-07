import { Menu } from 'src/menu/entities/menu.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '角色编码,用于鉴权',
    nullable: true,
  })
  roleCode: string;

  @Column({
    comment: '角色名称',
    nullable: true,
  })
  roleName: string;

  @Column({
    comment: '描述',
    nullable: true,
  })
  description: string;

  @Column({
    comment: '角色类型',
    nullable: true,
    default: 'normal',
  })
  roleKind: string;

  @CreateDateColumn({
    comment: '创建时间',
    type: 'timestamp',
  })
  createTime: Date;

  @ManyToMany(() => Menu, (menu) => menu.role, {
    cascade: true,
  })
  @JoinTable()
  menu: Menu[];

  @ManyToMany(() => User, (user) => user.role)
  user: User[];
}
