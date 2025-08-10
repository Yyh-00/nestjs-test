import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Response } from 'express';

// 不指定具体异常类型，捕获所有异常
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取 HTTP 上下文
    const response = ctx.getResponse<Response>(); // 获取响应对象

    // 处理 HTTP 异常（如 BadRequestException、NotFoundException 等）
    if (exception instanceof HttpException) {
      const status = exception.getStatus(); // 获取异常状态码
      const errorResponse = exception.getResponse(); // 获取异常原始响应内容

      // 格式化响应（统一结构）
      const result = {
        code: status, // 状态码
        message:
          typeof errorResponse === 'object'
            ? isArray((errorResponse as any).message)
              ? (errorResponse as any).message.join(', ')
              : (errorResponse as any).message || exception.message
            : errorResponse || exception.message, // 错误信息
        data: null, // 数据字段（异常时通常为 null）
      };

      response.status(status).json(result);
    }
    // 处理非 HTTP 异常（如代码错误、未知异常）
    else {
      const status = HttpStatus.INTERNAL_SERVER_ERROR; // 默认 500 状态码
      const result = {
        code: status,
        message: '服务器内部错误', // 生产环境避免暴露具体错误信息
        data: null,
        // 开发环境可添加详细错误信息（可选）
        ...(process.env.NODE_ENV === 'development' && {
          stack: (exception as any).sqlMessage || (exception as any).stack,
        }),
      };

      response.status(status).json(result);
    }
  }
}
