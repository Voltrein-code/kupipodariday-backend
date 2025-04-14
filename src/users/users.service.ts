import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findMany(query: FindManyOptions<User>) {
    return this.userRepository.find(query);
  }

  async create(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    return this.userRepository.save({
      ...createUserDto,
      password: hash,
    });
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;

    if (password) {
      return this.userRepository.save({
        ...user,
        ...updateUserDto,
        password: await bcrypt.hash(password, 10),
      });
    }

    return this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
