import { Length, IsNumber } from 'class-validator';

export class CreateUserDto {
  @Length(2, 50, { message: '用户名长度必须在2-50之间' })
  name: string;

  @IsNumber({}, { message: 'isActive 必须是 0 或 1' })
  isActive: number;
}
