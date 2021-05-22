import { UsersController } from './users.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Gender } from './schemas/user.enum';
import { UpdateUserDto } from './dto/update-user.dto';

const mockService = () => ({
  readUser: jest.fn(),
  readAllUsers: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  createUser: jest.fn(),
});

describe('UserController', () => {
  let usersController: UsersController;
  let usersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: mockService,
        },
      ],
    }).compile();

    usersController = await module.get<UsersController>(UsersController);
    usersService = await module.get<UsersService>(UsersService);
  });

  describe('test', () => {
    it('testtest', () => {
      expect(true).toBeTruthy();
    });
  });

  describe('addUser', () => {
    it('should return id of the new user', async () => {
      const newUser: CreateUserDto = {
        name: 'Tom',
        gender: Gender.Male,
        age: 22,
      };
      const mockUserId = 'userId';
      usersService.createUser.mockResolvedValue(mockUserId);
      expect(usersService.createUser).not.toHaveBeenCalled();

      const result = await usersController.addUser(newUser);
      expect(usersService.createUser).toHaveBeenCalledWith(newUser);
      expect(result.id).toEqual(mockUserId);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users: Array<CreateUserDto> = [
        {
          name: 'Tom',
          gender: Gender.Male,
          age: 22,
        },
        {
          name: 'Mary',
          gender: Gender.Female,
          age: 19,
        },
        {
          name: 'Keid',
          gender: Gender.Male,
          age: 30,
        },
      ];
      usersService.readAllUsers.mockResolvedValue(
        users.map((user, index) => ({ ...user, id: 'userId' + index })),
      );

      expect(usersService.readAllUsers).not.toHaveBeenCalled();

      const result = await usersController.getAllUsers();
      expect(usersService.readAllUsers).toHaveBeenCalled();
      expect(result).toEqual(
        users.map((user) => ({ ...user, id: expect.anything() })),
      );
    });
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const mockUser = {
        id: 'userId',
        name: 'Tom',
        gender: Gender.Male,
        age: 22,
      };
      usersService.readUser.mockResolvedValue(mockUser);
      expect(usersService.readUser).not.toHaveBeenCalled();

      const mockUserId = 'userId';
      const result = await usersController.getUser(mockUserId);
      expect(usersService.readUser).toHaveBeenCalledWith(mockUserId);
      expect(result).toStrictEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update the user', async () => {
      const updateUserId = 'updateUserId';
      const updateUser: UpdateUserDto = {
        name: 'Super Man',
        gender: Gender.Male,
        age: 100,
      };
      usersService.updateUser.mockResolvedValue(null);
      expect(usersService.updateUser).not.toHaveBeenCalled();

      const result = await usersController.updateUser(updateUserId, updateUser);
      expect(usersService.updateUser).toHaveBeenCalledWith(
        updateUserId,
        updateUser,
      );
      expect(result).toBeNull();
    });
  });

  describe('removeUser', () => {
    it('should remove the user', async () => {
      const deleteUserId = 'deleteUserId';
      usersService.deleteUser.mockResolvedValue(null);
      expect(usersService.deleteUser).not.toHaveBeenCalled();

      const result = await usersController.removeUser(deleteUserId);
      expect(usersService.deleteUser).toHaveBeenCalledWith(deleteUserId);
      expect(result).toBeNull();
    });
  });
});
