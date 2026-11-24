import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepo: Repository<User>) {}

  async create(dto: CreateUserDto) {
    await this.assertEmailFree(dto.email);
    const passwordHash = await bcrypt.hash(dto.password, 10); // never save the plain password
    const saved = await this.usersRepo.save(
      this.usersRepo.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        passwordHash,
      }),
    );
    return this.toResponse(saved);
  }

  async findOne(id: number) {
    const user = await this.usersRepo.findOne({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException({ message: 'User not found.', errors: [`No user exists with ID ${id}.`] });
    }
    return this.toResponse(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException({ message: 'User not found.', errors: [`No user exists with ID ${id}.`] });
    }
    if (dto.email && dto.email !== user.email) await this.assertEmailFree(dto.email);
    Object.assign(user, dto);
    return this.toResponse(await this.usersRepo.save(user));
  }

  // used by AuthService (passwordHash is hidden by default, so we ask for it here)
  findByEmailWithPassword(email: string) {
    return this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email })
      .getOne();
  }

  private async assertEmailFree(email: string) {
    const exists = await this.usersRepo.findOne({ where: { email } });
    if (exists) {
      throw new ConflictException({
        message: 'Email is already registered.',
        errors: [`A user with email ${email} already exists.`],
      });
    }
  }

  // only these fields are returned, never passwordHash
  private toResponse(u: User) {
    return {
      userId: u.userId,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      dateCreated: u.dateCreated,
    };
  }
}
