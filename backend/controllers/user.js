import { UserService } from '../services/user.js';
import { checkForRole } from '../middlewares/authorization_middleware.js';

export function user(app) {
  app.get(
    '/user',
    checkForRole('admin'),
    async (req, res) => {
      const page = parseInt(req.query.page || '1', 10);
      const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
      const skip = (page - 1) * limit;

      const query = { ...req.query };
      delete query.page;
      delete query.limit;

      const [users, total] = await Promise.all([
        UserService.get(query, { skip, limit }),
        UserService.count(query),
      ]);

      const result = users.map(user => ({
        uuid: user.uuid,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        roles: user.roles,
      }));

      res.send({
        data: result,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  );

  app.post(
    '/user',
    checkForRole('admin'),
    async (req, res) => {
      await UserService.create(req.body);
      res.status(204).send();
    } 
  );

  app.delete(
    '/user/:uuid',
    checkForRole('admin'),
    async (req, res) => {
      await UserService.deleteByUuid(req.params.uuid);
      res.status(204).send();
    }
  );

  app.patch(
    '/user/:uuid',
    checkForRole('admin'),
    async (req, res) => {
      await UserService.updateByUuid(req.params.uuid, req.body);
      res.status(204).send();
    }
  );
}