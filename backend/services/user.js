import { InvalidArgumentException } from "../exceptions/invalid_argument_exception.js";
import { getDependency } from "../libs/dependencies.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export function sanitizeUserFilter(filter) {
  if (!filter || typeof filter !== 'object') return {};
  const sanitized = {};
  const allowedKeys = ['username', 'email', 'fullName', 'roles', 'uuid'];
  for (const key of allowedKeys) {
    if (filter[key] !== undefined) {
      sanitized[key] = filter[key];
    }
  }
  return sanitized;
}

export class UserService {
  static async getSingleOrNullByUsername(username) {
    const UserModel = getDependency('UserModel');
    return await UserModel.findOne({ username });
  }

  static async get(filter, options = {}) {
    const UserModel = getDependency('UserModel');
    const safeFilter = sanitizeUserFilter(filter);
    let query = UserModel.find(safeFilter);
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    return await query;
  }

  static async count(filter) {
    const UserModel = getDependency('UserModel');
    return await UserModel.countDocuments(sanitizeUserFilter(filter));
  }

  static async create(user) {
    if (!user.username) {
      throw new InvalidArgumentException('Falta el parámetro username.');
    }

    if (!user.email) {
      throw new InvalidArgumentException('Falta el parámetro email.');
    }

    if (!user.password) {
      throw new InvalidArgumentException('Falta el parámetro password.');
    }

    const fullName = user.fullName || user.username;
    const roles = user.roles || ['user'];

    if (!Array.isArray(roles)) {
      throw new InvalidArgumentException('El parámetro roles dbe ser una lista.');
    }    
    
    const UserModel = getDependency('UserModel');
    const existingUser = await  UserModel.find({ username: user.username });
    if (existingUser.length > 0) {
      throw new InvalidArgumentException('Ese usuario ya existe.');
    }

    if (user.password) {
      user.hashedPassword = bcrypt.hashSync(user.password, 10);
      delete user.password;
    }
    
    user.uuid = crypto.randomUUID();
    user.fullName = fullName;
    user.roles = roles;

    const newUser = new UserModel(user);
    await newUser.save();

    return newUser;
  }

  static async deleteByUuid(uuid) {
    if (!uuid) {
      throw new InvalidArgumentException('Falta el parámetro uuid.');
    }

    const UserModel = getDependency('UserModel');
    const user = await UserModel.findOneAndDelete({ uuid });
    if (!user) {
      throw new InvalidArgumentException('Usuario no encontrado.');
    }
  }

  static async updateByUuid(uuid, data) {
    if (!uuid) {
      throw new InvalidArgumentException('Falta el parámetro uuid.');
    }

    const UserModel = getDependency('UserModel');
    const user = await UserModel.findOneAndUpdate(
      { uuid },
      { $set: data },
    );
    if (!user) {
      throw new InvalidArgumentException('Usuario no encontrado.');
    }
  }
}