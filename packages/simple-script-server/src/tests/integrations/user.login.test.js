import chaiHttp from 'chai-http';
import { use, request, expect } from 'chai';
import app from '../..';
import models from '../../models';
import { singleUser } from '../seed/user.seed';

use(chaiHttp);

const LOGIN_ROUTE = '/api/auth/login';
const SIGNUP_ROUTE = '/api/auth/signup';

describe(LOGIN_ROUTE, () => {
  before(async () => {
    await models.User.deleteMany({});
    await request(app).post(SIGNUP_ROUTE).send(singleUser);
  });

  it('should allow user login with valid details', async () => {
    const res = await request(app)
      .post(LOGIN_ROUTE)
      .send({ email: singleUser.email, password: singleUser.password });
    expect(res.status).eql(200);
    expect(res.body.message).eql('success');
    expect(res.body.data.firstName).eql(singleUser.firstName);
    expect(res.body.data.lastName).eql(singleUser.lastName);
    expect(res.body.data.email).eql(singleUser.email);
    expect(res.body.data.isAdmin).eql(false);
    expect(res.body).to.include.keys('token');
  });


  it('should return an error if a wrong email is used', async () => {
    const res = await request(app)
      .post(LOGIN_ROUTE)
      .send({ email: 'wrong@someone.com', password: singleUser.password });
    expect(res.status).eql(401);
    expect(res.body.message).eql('Invalid credentials');
  });

  it('should return an error if a wrong password is used', async () => {
    const res = await request(app)
      .post(LOGIN_ROUTE)
      .send({ email: singleUser.email, password: 'wrongPass' });
    expect(res.status).eql(401);
    expect(res.body.message).eql('Invalid credentials');
  });
});
