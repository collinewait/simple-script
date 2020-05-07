import chaiHttp from 'chai-http';
import { use, request, expect } from 'chai';
import app from '../..';
import models from '../../models';
import singleUser from '../seed/user.seed';

use(chaiHttp);

const SIGNUP_ROUTE = '/api/auth/signup';

describe(SIGNUP_ROUTE, () => {
  beforeEach(async () => {
    await models.User.deleteMany({});
  });
  it('should be able to create a new  user', async () => {
    const res = await request(app).post(SIGNUP_ROUTE).send(singleUser);
    expect(res.status).eql(201);
    expect(res.body.message).eql('success');
    expect(res.body.data.firstName).eql(singleUser.firstName);
    expect(res.body.data.lastName).eql(singleUser.lastName);
    expect(res.body.data.email).eql(singleUser.email);
    expect(res.body.data.isAdmin).eql(false);
    expect(res.body).to.include.keys('token');
  });

  it('should return an error if a user already exists', async () => {
    await models.User.create(singleUser);
    const res = await request(app).post(SIGNUP_ROUTE).send(singleUser);
    expect(res.status).eql(401);
    expect(res.body.message).eql('Invalid details, please check your email address or password');
  });

  it('should return an error if first name is missing', async () => {
    const res = await request(app).post(SIGNUP_ROUTE).send({ ...singleUser, firstName: '' });
    expect(res.status).eql(401);
    expect(res.body.message).eql('Invalid details, all fields are required');
  });

  it('should return an error if last name is missing', async () => {
    const res = await request(app).post(SIGNUP_ROUTE).send({ ...singleUser, lastName: '' });
    expect(res.status).eql(401);
    expect(res.body.message).eql('Invalid details, all fields are required');
  });

  it('should return an error if password is missing', async () => {
    const res = await request(app).post(SIGNUP_ROUTE).send({ ...singleUser, password: '' });
    expect(res.status).eql(401);
    expect(res.body.message).eql('Invalid details, all fields are required');
  });

  it('should return an error if email is missing', async () => {
    const res = await request(app).post(SIGNUP_ROUTE).send({ ...singleUser, email: '' });
    expect(res.status).eql(401);
    expect(res.body.message).eql('Invalid details, all fields are required');
  });

  it('should return an error if a wrong email format is used', async () => {
    const res = await request(app).post(SIGNUP_ROUTE).send({ ...singleUser, email: 'wrongEmailHere' });
    expect(res.status).eql(401);
    expect(res.body.message).eql('Invalid details, please check your email address or password');
  });
});
