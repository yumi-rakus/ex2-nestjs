import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './models/user.model';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<string> {
    const userId = uuid();
    const newUser = new User(
      userId,
      createUserDto.name,
      createUserDto.gender,
      createUserDto.age,
    );

    try {
      await this.usersRepository.save(newUser);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return userId;
  }

  async readAllUsers(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
  }

  async readUser(userId: string): Promise<UsersEntity> {
    const found = await this.usersRepository.findOne(userId);

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UsersEntity> {
    const found = await this.readUser(userId);

    // name
    if (updateUserDto.name) {
      found.name = updateUserDto.name;
    }

    // gender
    if (updateUserDto.gender) {
      found.gender = updateUserDto.gender;
    }

    // age
    if (updateUserDto.age) {
      found.age = updateUserDto.age;
    }

    await this.usersRepository.save(found);

    return found;
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.usersRepository.delete(userId);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
