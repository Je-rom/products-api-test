import { UserModel } from '../models/user.model';
import { comparePassword, hashPassword } from '../utils/password';
import { AppError } from '../utils/appError';
import { CreateUserDto } from '../dtos/createUser.dto';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { plainToInstance } from 'class-transformer';
import { validateEntity } from '../utils/validation';

export class AuthService {
  public static async signUp(userData: CreateUserDto) {
    const userDto = plainToInstance(CreateUserDto, userData);
    await validateEntity(userDto);

    const existingUser = await UserModel.findOne({ email: userDto.email });
    if (existingUser) {
      throw new AppError('User already exists with that email', 400);
    }

    userDto.password = await hashPassword(userDto.password);

    const newUser = await UserModel.create(userDto);

    return newUser;
  }

  public static async signIn(loginData: LoginUserDto) {
    const data = plainToInstance(LoginUserDto, loginData);
    await validateEntity(data);

    const ifUserExist = await UserModel.findOne({ email: loginData.email });
    if (!ifUserExist) {
      throw new AppError('User not found', 404);
    }
    const isPasswordCorrect = await comparePassword(
      loginData.password,
      ifUserExist.password,
    );
    if (!isPasswordCorrect) {
      throw new AppError(
        'Incorrect password, please try again with your correct password',
        404,
      );
    }
    return ifUserExist;
  }
}
