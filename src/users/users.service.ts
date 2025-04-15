import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findOne(query: FindOneOptions<User>) {
    return this.userRepository.findOneOrFail(query);
  }

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

  findAll() {
    return this.userRepository.find();
  }

  findById(id: number) {
    return this.userRepository.findOneOrFail({ where: { id } });
  }
}
