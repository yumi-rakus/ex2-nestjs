import { UsersController } from './users.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Gender } from './schemas/user.enum';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
  });

  describe('addUser', () => {
    it('should return id of the new user', async () => {
      const newUser: CreateUserDto = {
        name: 'Tom',
        gender: Gender.Male,
        age: 22,
      };
      expect(await usersController.addUser(newUser)).toHaveProperty('id');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users: CreateUserDto[] = [
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

      await usersController.addUser(users[0]);
      await usersController.addUser(users[1]);
      await usersController.addUser(users[2]);

      expect(await usersController.getAllUsers()).toEqual(
        users.map((user) => ({ ...user, id: expect.anything() })),
      );
    });
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const users: CreateUserDto[] = [
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

      const user0 = await usersController.addUser(users[0]);
      const user1 = await usersController.addUser(users[1]);
      const user2 = await usersController.addUser(users[2]);

      const userId0 = user0.id;
      const userId1 = user1.id;
      const userId2 = user2.id;

      expect(await usersController.getUser(userId0)).toEqual({
        ...users[0],
        id: userId0,
      });
      expect(await usersController.getUser(userId1)).toEqual({
        ...users[1],
        id: userId1,
      });
      expect(await usersController.getUser(userId2)).toEqual({
        ...users[2],
        id: userId2,
      });
    });
  });

  describe('updateUser', () => {
    it('should update the user', async () => {
      const newUser: CreateUserDto = {
        name: 'Mary',
        gender: Gender.Female,
        age: 19,
      };

      const addedUser = await usersController.addUser(newUser);
      const addedUserId = addedUser.id;
      const updateUser: UpdateUserDto = {
        name: 'Super Man',
        gender: Gender.Male,
        age: 100,
      };

      await usersController.updateUser(addedUserId, updateUser);

      expect(await usersController.getUser(addedUserId)).toEqual({
        ...updateUser,
        id: addedUserId,
      });
    });
  });

  describe('removeUser', () => {
    it('should remove the user', async () => {
      const users: CreateUserDto[] = [
        {
          name: 'Keid',
          gender: Gender.Male,
          age: 30,
        },
        {
          name: 'Jobs',
          gender: Gender.Male,
          age: 56,
        },
      ];

      await usersController.addUser(users[0]);
      const user1 = await usersController.addUser(users[1]);
      const userId1 = user1.id;

      await usersController.removeUser(userId1);

      expect(await usersController.getAllUsers()).toHaveLength(1);
      expect(async () => await usersController.getUser(userId1)).toThrow();
    });
  });
});
