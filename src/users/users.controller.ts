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
import { UsersEntity } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async addUser(@Body() createUserDto: CreateUserDto): Promise<{ id: string }> {
    const userId = await this.usersService.createUser(createUserDto);

    return {
      id: userId,
    };
  }

  @Get()
  async getAllUsers(): Promise<UsersEntity[]> {
    return await this.usersService.readAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UsersEntity> {
    return await this.usersService.readUser(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.updateUser(id, updateUserDto);
    return null;
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return null;
  }
}
