import { UserService } from '../services/user.js';

export function register(app) {
  app.post(
    '/register',
    async (req, res) => {
      const user = await UserService.create(req.body);

      res.status(201).send({
        uuid: user.uuid,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        roles: user.roles,
      });
    }
  );
}