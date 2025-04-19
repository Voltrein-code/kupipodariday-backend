import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const { amount, hidden, itemId } = createOfferDto;

    const wish = await this.wishRepository.findOne({
      where: { id: itemId },
      relations: ['owner', 'offers'],
    });

    if (!wish) throw new NotFoundException('Не удалось найти подарок по id');

    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Запрещено скидываться на свой же подарок');
    }
  }

  findAll() {
    return `This action returns all offers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return `This action updates a #${id} offer`;
  }

  remove(id: number) {
    return `This action removes a #${id} offer`;
  }
}
