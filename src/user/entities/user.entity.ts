import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn() // 声明该字段为表的主键，并且会自动生成（自增整数类型，默认从 1 开始）。
  id: number; // 对应int类型

  @Column({ length: 50, unique: true }) // 限制字符串长度为 50，示该字段的值必须唯一（数据库层面会创建唯一索引），避免重复name。
  name: string; // 对应数据库中 VARCHAR(50) 类型，未指定 length 时，默认字符串长度通常为 255，对应 VARCHAR(255)

  @Column({ default: 0 }) //置默认值为 true
  isActive: number; // 布尔类型在数据库中通常映射为 TINYINT(1)（1 表示 true，0 表示 false）

  // 13位时间戳更新时间字段
  @Column({
    name: 'update_time',
    type: 'bigint',
    transformer: {
      to: (value: number) => value,
      from: (value: number) => Number(value),
    },
  })
  updateTime: number;

  // 可选：创建时间字段（13位时间戳）
  @Column({
    name: 'create_time',
    type: 'bigint',
    transformer: {
      to: (value: number) => value,
      from: (value: number) => Number(value),
    },
  })
  createTime: number;

  // 插入时自动设置时间戳
  @BeforeInsert()
  setTimestampsOnInsert() {
    const now = Date.now(); // 获取13位时间戳

    this.createTime = now;
    this.updateTime = now;
  }

  // 更新时自动更新时间戳
  @BeforeUpdate()
  setTimestampOnUpdate() {
    this.updateTime = Date.now();
  }
}
