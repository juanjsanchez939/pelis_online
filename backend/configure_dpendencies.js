import { addDependency } from './libs/dependencies.js';
import { UserService } from './services/user.js';
import { LoginService } from './services/login.js';
import { MovieService } from './services/movie.js';
import UserModel from './models/user.js';
import MovieModel from './models/movie.js';

export default function configureDependencies() {
  addDependency('UserService', UserService);
  addDependency('LoginService', LoginService);
  addDependency('UserModel', UserModel);
  addDependency('MovieService', MovieService);
  addDependency('MovieModel', MovieModel);
}