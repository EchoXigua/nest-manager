import { Role } from 'src/role/entities/role.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

enum Status {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '登录账号',
  })
  account: string;

  @Column({
    comment: '邮箱',
    nullable: true,
  })
  email: string;

  @Column({
    comment: '手机号',
    nullable: true,
  })
  phone: string;

  @Column({
    comment: '登录密码',
  })
  password: string;

  @Column({
    comment: '用户名',
  })
  username: string;

  @Column({
    comment: '头像',
    nullable: true,
  })
  avatar: string;

  @Column({
    comment: '登录IP',
    nullable: true,
  })
  loginIp: string;

  @Column({
    comment: '登录时间',
    nullable: true,
  })
  loginTime: string;

  @Column({
    comment: '状态',
    type: 'enum',
    enum: Status,
    default: Status.ENABLED,
  })
  status: Status;

  @Column({
    comment: '登录重试次数：超过3次锁定',
    default: 0,
  })
  loginRetry: number;

  @Column({
    comment: '登录重试时间：用于动态计算登录锁定时间',
    default: '0',
  })
  loginRetryTime: string;

  @CreateDateColumn({
    comment: '创建时间',
    type: 'timestamp',
  })
  createAt: Date;

  @ManyToMany(() => Role, (role) => role.user, {
    cascade: true,
  })
  @JoinTable()
  role: Role[];
}
