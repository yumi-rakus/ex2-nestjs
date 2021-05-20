import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './models/user.model';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  createUser(createUserDto: CreateUserDto) {
    const userId = uuid();
    const newUser = new User(
      userId,
      createUserDto.name,
      createUserDto.gender,
      createUserDto.age,
    );
    this.users.push(newUser);
    return userId;
  }

  readAllUsers() {
    return [...this.users];
  }

  readUser(userId: string) {
    const [user, _index] = this.findUser(userId);
    return { ...user };
  }

  updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const [user, index] = this.findUser(userId);
    const updateUser = { ...user };

    // name
    if (updateUserDto.name) {
      updateUser.name = updateUserDto.name;
    }

    // gender
    if (updateUserDto.gender) {
      updateUser.gender = updateUserDto.gender;
    }

    // age
    if (updateUserDto.age) {
      updateUser.age = updateUserDto.age;
    }

    this.users[index] = { ...updateUser };
  }

  deleteUser(userId: string) {
    const [user, _index] = this.findUser(userId);
    this.users = this.users.filter((u: User) => u.id !== user.id);
  }

  private findUser(id: string): [User, number] {
    const index = this.users.findIndex((u: User) => u.id === id);
    const user = this.users[index];

    if (!user) {
      throw new NotFoundException(`Could not find the user of id: ${id}`);
    }
    return [user, index];
  }
}
