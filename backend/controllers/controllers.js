import { login } from './login.js';
import { register } from './register.js';
import { user } from './user.js';
import { movie } from './movie.js';

export function controllers(app) {
  login(app);
  register(app);
  user(app);
  movie(app);
}