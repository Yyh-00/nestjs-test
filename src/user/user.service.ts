import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
      message: '用户创建成功',
      data: true,
    };
  }

  async getList(searchData: SearchUserDto): Promise<IResponseInfo> {
    console.log('🚀 ~ UserService ~ getList ~ searchData:', searchData);

    // 解构查询参数并设置默认分页值
    const { name, isActive, pageIndex, pageSize } = searchData;

    // 构建查询条件
    const queryCondition: any = {};

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
        list: users, // 查询到的用户列表
        pageIndex, // 当前页码
        pageSize, // 每页条数
        total,
      },
    };
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
  async remove(id: number): Promise<IResponseInfo> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new HttpException(
        {
          message: `id ${id} 不存在`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      code: 0,
      message: '删除成功',
      data: true,
    };
  }
}
