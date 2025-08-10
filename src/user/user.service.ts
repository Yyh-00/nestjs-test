import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IResponseInfo } from '../common/interfaces/common.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  // 创建用户
  async create(createUserDto: CreateUserDto): Promise<IResponseInfo> {
    const repeatUser = await this.usersRepository.findOne({
      where: { name: createUserDto.name },
    });

    if (repeatUser) {
      throw new HttpException(
        {
          message: `用户名 ${createUserDto.name} 已存在`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    this.usersRepository.create(createUserDto);

    return {
      code: 0,
      message: '创建成功',
      data: true,
    };
  }

  // 获取所有用户
  findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  // 根据ID获取用户
  async findOne(id: number): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Users #${id} not found`);
    }
    return user;
  }

  // 更新用户
  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    await this.usersRepository.update(id, updateUserDto);
    const updatedUser = await this.usersRepository.findOneBy({ id });
    if (!updatedUser) {
      throw new NotFoundException(`Users #${id} not found`);
    }
    return updatedUser;
  }

  // 删除用户
  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Users #${id} not found`);
    }
  }
}
