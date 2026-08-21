import { InvalidArgumentException } from '../exceptions/invalid_argument_exception.js';
import { InvalidCredentialsException } from '../exceptions/invalid_credentials_exception.js';
import { getDependency } from '../libs/dependencies.js';
import bcrypt from 'bcrypt';
import config from '../config.js';
import jwt from 'jsonwebtoken';

export class LoginService {
  static async login(credentials) {
    if (!credentials
      || !credentials.username
      || !credentials.password
      || typeof credentials.username !== 'string'
      || typeof credentials.password !== 'string'
    )
      throw new InvalidArgumentException();

    const UserService = getDependency('UserService');
    const user = await UserService.getSingleOrNullByUsername(credentials.username);
    if (!user)
      throw new InvalidCredentialsException();

    if (!(await bcrypt.compare(credentials.password, user.hashedPassword)))
      throw new InvalidCredentialsException();

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        fullName: user.fullName,
        roles: user.roles,
      },
      config.jwtKey,
      {
        expiresIn: '24h'
      }
    );

    return {
      token,
      user: {
        uuid: user.uuid,
        username: user.username,
        fullName: user.fullName,
        roles: user.roles,
      },
    };
  }
}