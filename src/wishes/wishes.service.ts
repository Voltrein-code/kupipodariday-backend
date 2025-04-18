import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import deletePassword from 'src/utils/deletePasswords';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  create(createWishDto: CreateWishDto, owner: User) {
    const newWish = this.wishRepository.create({ ...createWishDto, owner });
    return this.wishRepository.save(newWish);
  }

  async findAll(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({ relations: ['owner'] });

    return wishes.map((el) => ({ ...el, owner: deletePassword(el.owner) }));
  }

  async findOne(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });

    if (!wish) throw new NotFoundException('Не удалось найти подарок по id');

    wish.owner = deletePassword(wish.owner);
    wish.offers = wish.offers.map((el) => {
      return {
        ...el,
        user: deletePassword(el.user),
      };
    });

    return wish;
  }

  async findLast() {
    const lastWishes = await this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
      relations: ['owner'],
    });

    return lastWishes.map((el) => ({ ...el, owner: deletePassword(el.owner) }));
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
