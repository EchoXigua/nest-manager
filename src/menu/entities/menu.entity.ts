import { Role } from 'src/role/entities/role.entity';
import {
  BaseEntity,
  Entity,
  Tree,
  TreeChildren,
  TreeParent,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Tree('materialized-path')
@Entity()
export class Menu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  // @JoinTable()
  // //第一个参数返回值为相关的实体
  // @ManyToMany((type) => FlavorEntity, (flavor) => flavor.coffees, {
  //   cascade: true,
  // })
  // flavor: string[];

  @Column({ default: 0 })
  recommerdations: number;

  @Column({
    comment: '菜单标题',
    unique: true,
  })
  title: string;

  @Column({
    comment: '菜单全名',
    nullable: true,
  })
  fullName: string;

  @Column({
    comment: '菜单路径',
  })
  url: string;

  @Column({
    comment: '前端组件',
    nullable: true,
  })
  component: string;

  @Column({
    comment: '描述',
    nullable: true,
  })
  description: string;

  @Column({
    comment: '创建人ID',
    nullable: true,
  })
  createUser: string;

  @Column({
    comment: '创建人名称',
    nullable: true,
  })
  createUserName: string;

  @Column()
  menuType: string;

  @Column({
    comment: '是否缓存路由',
    default: true,
  })
  keepAlive: boolean;

  @Column({
    comment: '是否聚合路由',
    default: false,
  })
  alwaysShow: boolean;

  @Column({
    comment: '是否隐藏路由',
    default: false,
  })
  hidden: boolean;

  @Column({
    comment: '是否路由菜单',
    default: true,
  })
  route: boolean;

  @Column({
    comment: '路由图标',
    nullable: true,
  })
  icon: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: string;

  @ManyToMany(() => Role, (role) => role.menu)
  role: Role[];

  @TreeChildren({
    cascade: true,
    //设置true 会触发 TreeParent中的onDelete
  })
  children: Menu[];

  @TreeParent({
    onDelete: 'CASCADE',
  })
  //在pid 被删除的时候，其下的子节点会被全部删除
  pid: Menu | '0';
}
