import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    usersService = await module.get<UsersService>(UsersService);
    usersRepository = await module.get(getRepositoryToken(UsersEntity));
  });

  describe('readAllUsers', () => {
    it('read all users', async () => {
      const mockUsers = [
        {
          id: 'userId0',
          name: 'user0',
          gender: 'male',
          age: 22,
        },
        {
          id: 'userId1',
          name: 'user1',
          gender: 'female',
          age: 25,
        },
      ];
      usersRepository.find.mockResolvedValue(mockUsers);
      expect(usersRepository.find).not.toHaveBeenCalled();

      const result = await usersService.readAllUsers();
      expect(usersRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual(mockUsers);
    });
  });

  describe('readUser', () => {
    it('find success', async () => {
      const mockUser = {
        id: 'userId',
        name: 'user',
        gender: 'male',
        age: 22,
      };
      usersRepository.findOne.mockResolvedValue(mockUser);
      expect(usersRepository.findOne).not.toHaveBeenCalled();

      const mockUserId = 'userId';
      const result = await usersService.readUser(mockUserId);
      expect(usersRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('user is not found', async () => {
      const mockUserId = 'userId';
      usersRepository.findOne.mockResolvedValue(null);
      await expect(usersService.readUser(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('insert user', async () => {
      const mockUser: CreateUserDto = {
        name: 'username',
        gender: 'female',
        age: 20,
      };
      usersRepository.save.mockResolvedValue(mockUser);
      expect(usersRepository.save).not.toHaveBeenCalled();

      const result = await usersService.createUser(mockUser);
      expect(usersRepository.save).toHaveBeenCalled();
      expect(typeof result).toEqual('string');
    });
  });

  describe('deleteUser', () => {
    it('delete user', async () => {
      usersRepository.delete.mockResolvedValue({ affected: 1 });
      expect(usersRepository.delete).not.toHaveBeenCalled();
      const mockUserId = 'userId';
      await usersService.deleteUser(mockUserId);
      expect(usersRepository.delete).toHaveBeenCalledWith(mockUserId);
    });

    it('delete error', async () => {
      usersRepository.delete.mockResolvedValue({ affected: 0 });

      const mockUserId = 'userId';
      await expect(usersService.deleteUser(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('update user', async () => {
      const mockUpdateUser: UpdateUserDto = {
        name: 'updateUserName',
        gender: 'male',
        age: 30,
      };
      usersService.readUser = jest.fn().mockResolvedValue({
        id: 'userId',
        name: 'userName',
        gender: 'male',
        age: 25,
      });
      expect(usersService.readUser).not.toHaveBeenCalled();

      const mockUserId = 'userId';
      const result = await usersService.updateUser(mockUserId, mockUpdateUser);
      expect(usersService.readUser).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
      expect(result.name).toEqual(mockUpdateUser.name);
      expect(result.age).toEqual(mockUpdateUser.age);
    });
  });
});
