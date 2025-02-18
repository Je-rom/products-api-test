import request from 'supertest';
import { app } from '../../src/app';
import { UserModel } from '../../src/models/user.model';

jest.mock('../../src/models/user.model', () => ({
  UserModel: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

describe('AuthController', () => {
  const mockCreateUser = UserModel.create as jest.MockedFunction<
    typeof UserModel.create
  >;
  const mockFindUser = UserModel.findOne as jest.MockedFunction<
    typeof UserModel.findOne
  >;

  it('should sign up a new user successfully', async () => {
    const mockResponse = {
      email: 'user@example.com',
      password: 'hashedpassword',
      _id: 'user_id',
      first_name: 'John',
      second_name: 'Doe',
    };

    mockCreateUser.mockResolvedValue(mockResponse as any); 

    const response = await request(app).post('/api/v1/auth/signup').send({
      email: 'user@example.com',
      password: 'password123',
      first_name: 'John',
      second_name: 'Doe',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Registered successfully');
    expect(mockCreateUser).toHaveBeenCalledTimes(1);
  });

  it('should return error when email already exists during sign up', async () => {
    //mocking a rejected value when the user already exists
    mockCreateUser.mockRejectedValueOnce(new Error('User already exists'));

    const response = await request(app).post('/api/v1/auth/signup').send({
      email: 'user@example.com',
      password: 'password123',
      first_name: 'John',
      second_name: 'Doe',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });

  it('should sign in a user successfully with correct credentials', async () => {
    const mockUser = {
      email: 'user@example.com',
      password: 'hashedpassword',
      _id: 'user_id',
    };

    //mocking findOne this would also normally return a MongoDB document
    mockFindUser.mockResolvedValue(mockUser as any); // Cast as any

    const response = await request(app).post('/api/v1/auth/signin').send({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(mockFindUser).toHaveBeenCalledTimes(1);
  });

  it('should return error for incorrect password during sign in', async () => {
    mockFindUser.mockResolvedValue({
      email: 'user@example.com',
      password: 'hashedpassword',
    } as any);

    const response = await request(app).post('/api/v1/auth/signin').send({
      email: 'user@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Incorrect password');
  });
});
