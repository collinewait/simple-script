import chaiHttp from 'chai-http';
import { use, request, expect } from 'chai';
import app from '../..';
import models from '../../models';
import { singleUser, admin } from '../seed/user.seed';

use(chaiHttp);

const USERS_ROUTE = '/api/v1/users';
const LOGIN_ROUTE = '/api/auth/login';

describe(USERS_ROUTE, () => {
  let token;
  beforeEach(async () => {
    await models.User.deleteMany({});
    await models.User.create(admin);
    const res = await request(app)
      .post(LOGIN_ROUTE)
      .send({ email: admin.email, password: 'pass' });
    token = res.body.token;
  });
  context('POST', () => {
    it('should be able to create a new  user from admin side', async () => {
      const res = await request(app)
        .post(USERS_ROUTE)
        .set('Authorization', `Bearer ${token}`)
        .send(singleUser);
      expect(res.status).eql(201);
      expect(res.body.message).eql('success');
      expect(res.body.data.firstName).eql(singleUser.firstName);
      expect(res.body.data.lastName).eql(singleUser.lastName);
      expect(res.body.data.email).eql(singleUser.email);
      expect(res.body.data.isAdmin).eql(false);
    });
  });
});
