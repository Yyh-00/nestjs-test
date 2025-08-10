import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'; // 导入express
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 添加解析x-www-form-urlencoded的中间件
  app.use(express.urlencoded({ extended: true }));
  // 注册全局异常过滤器
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 启用全局验证管道
  // 会自动执行 DTO 中通过 class-validator 装饰器定义的验证规则（如 @IsString()、@Length(2, 50)）
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动过滤掉客户端传入的未在 DTO 中定义的字段，保证接口只接收预期的参数。
      transform: true, // 启用数据转换，将客户端传入的参数转为数据库设置的对应的类型。
      // disableErrorMessages: true, // 验证错误将不会返回给客户端
    }),
  );

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
