import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, SearchUserDto } from './dto/index.dto';
import { IResponseInfo } from '@/common/interfaces/common.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  // 创建用户
  async create(createUserDto: CreateUserDto): Promise<IResponseInfo> {
    const { name } = createUserDto;

    await this.findReaptUserByName(name);
    const userEntity = this.usersRepository.create(createUserDto);

    await this.usersRepository.save(userEntity);
    return {
      code: 0,
      message: '用户创建成功',
      data: true,
    };
  }

  async getList(searchData: SearchUserDto): Promise<IResponseInfo> {
    const { name, isActive, pageIndex, pageSize } = searchData;
    const queryCondition: { name?: any; isActive?: any } = {}; // 构建查询条件

    // 姓名模糊查询（如果提供了name）
    if (name) {
      queryCondition.name = Like(`%${name}%`);
    }

    // 活跃状态查询（如果提供了isActive）
    if (isActive !== undefined && isActive !== '') {
      queryCondition.isActive = isActive === '1';
    }

    // 计算分页偏移量
    const skip = (pageIndex - 1) * pageSize;

    // 执行分页查询和总数查询
    const [users, total] = await this.usersRepository.findAndCount({
      where: queryCondition,
      skip,
      take: pageSize,
      order: { createTime: 'DESC' }, // 按创建时间倒序，可根据需要修改
    });

    return {
      code: 0,
      message: '查询成功',
      data: {
        list: users,
        pageIndex,
        pageSize,
        total,
      },
    };
  }

  // 获取用户信息
  async getInfo(id: number): Promise<IResponseInfo> {
    const user = await this.vaildIdExist(id);

    return {
      code: 0,
      message: '查询成功',
      data: user,
    };
  }

  // 更新用户
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<IResponseInfo> {
    await this.vaildIdExist(id);
    await this.findReaptUserByName(updateUserDto.name);

    return {
      code: 0,
      data: true,
      message: '更新成功',
    };
  }

  // 删除用户
  async remove(id: number): Promise<IResponseInfo> {
    await this.vaildIdExist(id);

    return {
      code: 0,
      message: '删除成功',
      data: true,
    };
  }

  async findReaptUserByName(name: string): Promise<boolean> {
    const repeatUser = await this.usersRepository.findOneBy({ name });

    if (repeatUser) {
      throw new HttpException(
        {
          message: `用户名 ${name} 已存在`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  async vaildIdExist(id: string | number): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id: +id });

    if (!user) {
      throw new HttpException(
        {
          message: `id ${id} 不存在`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return user;
  }
}
