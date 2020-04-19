/* eslint-disable no-underscore-dangle */
import sinon from 'sinon';
import chai from 'chai';

import {
  userSignUp,
  userLogin,
  addUser,
} from '../../../controllers/user.controller';
import * as authUtils from '../../../util/auth.utils';

const { expect } = chai;

describe('User controllers', () => {
  let sandbox;
  const fakeToken = 'some-fake-token';
  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    sandbox.stub(authUtils, 'generateToken').returns(fakeToken);
  });
  afterEach(() => {
    sandbox.restore();
  });
  const mockResponse = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
  };
  const user = {
    _id: 'user-id',
    firstName: 'user-first-name',
    lastName: 'user-last-name',
    email: 'user-email',
    password: 'password',
    isAdmin: false,
  };

  context('userSignUp', () => {
    const mockRequest = () => ({
      body: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      },
      context: {
        models: {
          User: {
            create: sinon.stub().returns(user),
          },
        },
      },
    });

    it('should return a status code of 201 with a token after creating a user', async () => {
      const mockReq = mockRequest();
      const mockRes = mockResponse();

      await userSignUp(mockReq, mockRes);
      const { password, _id: id, ...returnedUser } = user;

      expect(mockRes.status.calledWith(201)).to.be.true();
      expect(
        mockRes.json.calledWith({
          message: 'success',
          status: 201,
          data: {
            ...returnedUser,
            id,
          },
          token: fakeToken,
        }),
      ).to.be.true();
    });
  });

  context('userLogin', () => {
    beforeEach(async () => {
      sandbox.stub(authUtils, 'validateCreds').returns({});
    });

    const mockRequest = () => {
      const { _id: id, ...rest } = user;
      return {
        body: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
        },
        context: {
          models: {
            User: {
              findByEmail: sinon.stub().returns({ id, ...rest }),
            },
          },
        },
      };
    };

    it('should return a status code of 200 with a token after logging in a user', async () => {
      const mockReq = mockRequest();
      const mockRes = mockResponse();

      await userLogin(mockReq, mockRes);
      const { password, _id: id, ...returnedUser } = user;

      expect(mockRes.status.calledWith(200)).to.be.true();
      expect(
        mockRes.json.calledWith({
          message: 'success',
          status: 200,
          data: {
            id,
            ...returnedUser,
          },
          token: fakeToken,
        }),
      ).to.be.true();
    });
  });

  context('addUser', () => {
    const mockRequest = () => ({
      body: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      },
      context: {
        models: {
          User: {
            create: sinon.stub().returns(user),
          },
        },
      },
    });

    it('should return a status code of 201 with a created user', async () => {
      const mockReq = mockRequest();
      const mockRes = mockResponse();

      await addUser(mockReq, mockRes);
      const { password, _id: id, ...returnedUser } = user;

      expect(mockRes.status.calledWith(201)).to.be.true();
      expect(
        mockRes.json.calledWith({
          message: 'success',
          status: 201,
          data: {
            ...returnedUser,
            id,
          },
        }),
      ).to.be.true();
    });
  });
});
