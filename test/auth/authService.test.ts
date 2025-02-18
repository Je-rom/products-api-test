import { AuthService } from '../../src/service/auth.service';
import { UserModel } from '../../src/models/user.model';
import { AppError } from '../../src/utils/appError';
import { hashPassword, comparePassword } from '../../src/utils/password';

jest.mock('../../src/models/user.model');
jest.mock('../../src/utils/password');

describe('AuthService', () => {
  let createUserMock: jest.Mock;
  let findUserMock: jest.Mock;
  let hashPasswordMock: jest.Mock;
  let comparePasswordMock: jest.Mock;

  beforeEach(() => {
    createUserMock = UserModel.create as jest.Mock;
    findUserMock = UserModel.findOne as jest.Mock;
    hashPasswordMock = hashPassword as jest.Mock;
    comparePasswordMock = comparePassword as jest.Mock;
  });

  it('should sign up a new user successfully', async () => {
    const mockUser = {
      email: 'user@example.com',
      password: 'hashedpassword',
      _id: 'user_id',
      first_name: 'John',
      second_name: 'Doe',
    };

    hashPasswordMock.mockResolvedValue('hashedpassword');
    createUserMock.mockResolvedValue(mockUser);

    const newUser = await AuthService.signUp({
      email: 'user@example.com',
      password: 'password123',
      first_name: 'John',
      second_name: 'Doe',
    });

    expect(newUser.email).toBe('user@example.com');
    expect(createUserMock).toHaveBeenCalledTimes(1);
  });

  it('should throw error if user already exists during sign up', async () => {
    const mockUser = { email: 'user@example.com' };
    findUserMock.mockResolvedValue(mockUser);

    try {
      await AuthService.signUp({
        email: 'user@example.com',
        password: 'password123',
        first_name: 'John',
        second_name: 'Doe',
      });
    } catch (error) {
      if (error instanceof AppError) {
        expect(error.message).toBe('User already exists with that email');
      }
    }
  });

  it('should sign in successfully with correct credentials', async () => {
    const mockUser = { email: 'user@example.com', password: 'hashedpassword' };
    findUserMock.mockResolvedValue(mockUser);

    comparePasswordMock.mockResolvedValue(true);

    const user = await AuthService.signIn({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(user.email).toBe('user@example.com');
    expect(findUserMock).toHaveBeenCalledTimes(1);
    expect(comparePasswordMock).toHaveBeenCalledTimes(1);
  });

  it('should throw error for incorrect password during sign in', async () => {
    const mockUser = { email: 'user@example.com', password: 'hashedpassword' };
    findUserMock.mockResolvedValue(mockUser);

    comparePasswordMock.mockResolvedValue(false);

    try {
      await AuthService.signIn({
        email: 'user@example.com',
        password: 'wrongpassword',
      });
    } catch (error) {
      if (error instanceof AppError) {
        expect(error.message).toBe(
          'Incorrect password, please try again with your correct password',
        );
      }
    }
  });
});
