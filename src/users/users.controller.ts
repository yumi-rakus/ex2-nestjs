import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  addUser(@Body() createUserDto: CreateUserDto) {
    const userId = this.usersService.createUser(createUserDto);

    return {
      id: userId,
    };
  }

  @Get()
  getAllUsers() {
    return this.usersService.readAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.readUser(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.usersService.updateUser(id, updateUserDto);
    return null;
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    this.usersService.deleteUser(id);
    return null;
  }
}
