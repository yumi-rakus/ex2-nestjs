import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserSchema } from './schemas/create-user.schema';
import { JoiValidationPipe } from '../common/pipes/validation.pipe';
import { updateUserSchema } from './schemas/update-user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(createUserSchema))
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
  @UsePipes(new JoiValidationPipe(updateUserSchema))
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
