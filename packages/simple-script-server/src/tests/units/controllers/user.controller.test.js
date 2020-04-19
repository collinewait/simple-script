/* eslint-disable no-underscore-dangle */
import sinon from 'sinon';
import chai from 'chai';

import { userSignUp } from '../../../controllers/user.controller';
import * as authUtils from '../../../util/auth.utils';

const { expect } = chai;

describe('User controllers', () => {
  context('userSignUp', () => {
    let sandbox;
    const fakeToken = 'some-fake-token';
    beforeEach(async () => {
      sandbox = sinon.createSandbox();
      sandbox.stub(authUtils, 'generateToken').returns(fakeToken);
    });
    afterEach(() => {
      sandbox.restore();
    });
    const user = {
      _id: 'user-id',
      firstName: 'user-first-name',
      lastName: 'user-last-name',
      email: 'user-email',
      password: 'password',
      isAdmin: false,
    };
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
    const mockResponse = () => {
      const res = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      return res;
    };

    it('should return a status code of 201 after creating a user', async () => {
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
});
