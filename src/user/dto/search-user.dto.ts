import { IsNumberString, IsOptional, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  isActive: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageIndex: number;

  @Type(() => Number)
  @Min(1)
  @IsNumber()
  pageSize: number;
}
