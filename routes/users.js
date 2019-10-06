import buildFormObj from '../lib/formObjectBuilder';
import { User } from '../models';

export default (router) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users', { users });
    })
    .get('userInfo', '/users/:id', async (ctx) => {
      const { id } = ctx.params;


      // TODO:
      const user = await User.findByPk(id);

      if (!user) {
        ctx.render('errors/notFound');
        return;
      }

      ctx.render('users/user', { user });
    })
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .post('users', '/users', async (ctx) => {
      const { body } = ctx.request;
      const user = User.build(body);

      try {
        await user.save();
        ctx.flash.set('User has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        // TODO: url changes to /users, but should stay at /users/new
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    });
};
