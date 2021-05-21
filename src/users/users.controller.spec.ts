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
    it('should return id of the new user', () => {
      const newUser: CreateUserDto = {
        name: 'Tom',
        gender: Gender.Male,
        age: 22,
      };
      expect(usersController.addUser(newUser)).toHaveProperty('id');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', () => {
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

      usersController.addUser(users[0]);
      usersController.addUser(users[1]);
      usersController.addUser(users[2]);

      expect(usersController.getAllUsers()).toEqual(
        users.map((user) => ({ ...user, id: expect.anything() })),
      );
    });
  });

  describe('getUser', () => {
    it('should return a user', () => {
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

      const userId0 = usersController.addUser(users[0]).id;
      const userId1 = usersController.addUser(users[1]).id;
      const userId2 = usersController.addUser(users[2]).id;

      expect(usersController.getUser(userId0)).toEqual({
        ...users[0],
        id: userId0,
      });
      expect(usersController.getUser(userId1)).toEqual({
        ...users[1],
        id: userId1,
      });
      expect(usersController.getUser(userId2)).toEqual({
        ...users[2],
        id: userId2,
      });
    });
  });

  describe('updateUser', () => {
    it('should update the user', () => {
      const newUser: CreateUserDto = {
        name: 'Mary',
        gender: Gender.Female,
        age: 19,
      };

      const addedUserId = usersController.addUser(newUser).id;
      const updateUser: UpdateUserDto = {
        name: 'Super Man',
        gender: Gender.Male,
        age: 100,
      };

      usersController.updateUser(addedUserId, updateUser);

      expect(usersController.getUser(addedUserId)).toEqual({
        ...updateUser,
        id: addedUserId,
      });
    });
  });

  describe('removeUser', () => {
    it('should remove the user', () => {
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

      usersController.addUser(users[0]);
      const userId1 = usersController.addUser(users[1]).id;

      usersController.removeUser(userId1);

      expect(usersController.getAllUsers()).toHaveLength(1);
      expect(() => usersController.getUser(userId1)).toThrow();
    });
  });
});
