import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, SearchUserDto } from './dto/index.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('getList')
  getList(@Query() searchData: SearchUserDto) {
    return this.userService.getList(searchData);
  }

  @Get('getInfo')
  getInfo(@Query('id') id: string) {
    return this.userService.getInfo(+id);
  }

  @Post('update')
  update(@Body() updateUserDto: UpdateUserDto) {
    const { id } = updateUserDto;

    return this.userService.update(+id, updateUserDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id); // 物理删除
  }
}
