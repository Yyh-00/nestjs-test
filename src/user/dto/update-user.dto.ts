import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Transform(({ value }) => Number(value)) // 尝试将字符串转换为数字
  @IsNumber({}, { message: 'id 必须为数字或数字字符串' })
  id: number;

  @IsOptional()
  name: string;

  @IsOptional()
  isActive?: number;
}
