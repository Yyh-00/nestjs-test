import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { Users } from '@/user/entities/user.entity';

@Module({
  imports: [
    // 加载 .env 文件并暴露环境变量
    ConfigModule.forRoot({
      isGlobal: true, // 全局可用，无需在其他模块重复导入
      envFilePath: [
        '.env', // 通用配置（所有环境共享）
        `.env.${process.env.NODE_ENV || 'development'}`, // 环境特定配置
      ], // 动态选择文件, 指定 .env 文件路径（默认就是根目录）
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '121.199.172.203',
      port: 3306,
      username: 'root', // 你的数据库用户名
      password: '123456', // 你的数据库密码
      database: 'nest-test-database', // 数据库名称
      entities: [Users],
      synchronize: true, // 开发环境下使用，自动同步实体到数据库
      autoLoadEntities: true, // 自动加载实体
      logging: true, // 打印SQL日志
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
