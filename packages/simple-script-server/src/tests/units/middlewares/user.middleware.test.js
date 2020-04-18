import sinon from 'sinon';
import chai from 'chai';
import dirtyChai from 'dirty-chai';

import { validateUser, verifyUser } from '../../../middlewares/user.middleware';
import { generateToken } from '../../../util/auth.utils';
import config from '../../../config';

const { expect } = chai;

chai.use(dirtyChai);

describe('User middleware', () => {
  context('validateUser', () => {
    const mockRequest = () => ({
      body: {
        email: 'email@wait.com',
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'pass',
      },
    });
    const mockResponse = () => {
      const res = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      return res;
    };
    const mockNext = () => sinon.stub().returns({});

    const missingDetails = {
      status: 401,
      message: 'Invalid details, all fields are required',
    };

    it('should return invalid details when the email is missing', async () => {
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          email: '',
        },
      };
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await validateUser(mockReq, mockRes, mockNxt);
      expect(mockRes.status.calledWith(401)).to.be.true();
      expect(mockRes.json.calledWith(missingDetails)).to.be.true();
      expect(mockNxt.calledOnce).to.be.false();
    });

    it('should return invalid details when the first name is missing', async () => {
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          firstName: '',
        },
      };
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await validateUser(mockReq, mockRes, mockNxt);
      expect(mockRes.status.calledWith(401)).to.be.true();
      expect(mockRes.json.calledWith(missingDetails)).to.be.true();
      expect(mockNxt.calledOnce).to.be.false();
    });

    it('should return invalid details when the last name is missing', async () => {
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          lastName: '',
        },
      };
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await validateUser(mockReq, mockRes, mockNxt);
      expect(mockRes.status.calledWith(401)).to.be.true();
      expect(mockRes.json.calledWith(missingDetails)).to.be.true();
      expect(mockNxt.calledOnce).to.be.false();
    });

    it('should return invalid details when the password is missing', async () => {
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          password: '',
        },
      };
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await validateUser(mockReq, mockRes, mockNxt);
      expect(mockRes.status.calledWith(401)).to.be.true();
      expect(mockRes.json.calledWith(missingDetails)).to.be.true();
      expect(mockNxt.calledOnce).to.be.false();
    });

    it('should return invalid details when the email is in a wrong format', async () => {
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          email: 'myemail.com',
        },
      };
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await validateUser(mockReq, mockRes, mockNxt);
      expect(mockRes.status.calledWith(401)).to.be.true();
      expect(
        mockRes.json.calledWith({
          status: 401,
          message:
            'Invalid details, please check your email address or password',
        }),
      ).to.be.true();
      expect(mockNxt.calledOnce).to.be.false();
    });

    it(`should return invalid details if a user already exists to prevent a person signing 
        up from having a clue on who exists`, async () => {
      const mockReq = {
        ...mockRequest(),
        context: {
          models: {
            User: {
              findByEmail: sinon.stub().returns({ _id: 'some user id here' }),
            },
          },
        },
      };
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await validateUser(mockReq, mockRes, mockNxt);
      expect(mockRes.status.calledWith(401)).to.be.true();
      expect(
        mockRes.json.calledWith({
          status: 401,
          message:
            'Invalid details, please check your email address or password',
        }),
      ).to.be.true();

      expect(mockNxt.calledOnce).to.be.false();
    });

    it('should call the next middleware when details are valid and user does not exist', async () => {
      const mockReq = {
        ...mockRequest(),
        context: {
          models: {
            User: {
              findByEmail: sinon.stub().returns(null),
            },
          },
        },
      };
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await validateUser(mockReq, mockRes, mockNxt);

      expect(mockNxt.calledOnce).to.be.true();
    });
  });

  context('verifyUser', () => {
    let sandbox;
    let token;
    beforeEach(async () => {
      sandbox = sinon.createSandbox();
      sandbox.stub(config, 'SECRET_KEY').value('test-secret-key');
      sandbox.stub(config, 'expiresIn').value('1hr');
      token = await generateToken({
        id: 'some id',
        email: 'some@email.com',
      });
    });
    afterEach(() => {
      sandbox.restore();
    });

    const mockRequest = () => ({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const mockResponse = () => {
      const res = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      return res;
    };
    const mockNext = () => sinon.stub().returns({});

    it('should return 401 status code when the token is missing', async () => {
      const mockReq = {
        ...mockRequest(),
        headers: {
          ...mockRequest().headers,
          authorization: undefined,
        },
      };
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await verifyUser(mockReq, mockRes, mockNxt);

      expect(mockRes.status.calledWith(401)).to.be.true();
      expect(mockNxt.calledOnce).to.be.false();
    });

    it('should return 401 status code when the token is invalid', async () => {
      const mockReq = {
        ...mockRequest(),
        headers: {
          ...mockRequest().headers,
          authorization: 'some-wrong-token',
        },
      };
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await verifyUser(mockReq, mockRes, mockNxt);

      expect(mockRes.status.calledWith(401)).to.be.true();
      expect(mockNxt.calledOnce).to.be.false();
    });

    it('should return 401 status code when the user is not found', async () => {
      const mockReq = {
        ...mockRequest(),
        context: {
          models: {
            User: {
              findByEmail: sinon.stub().returns(null),
            },
          },
        },
      };
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await verifyUser(mockReq, mockRes, mockNxt);

      expect(mockRes.status.calledWith(401)).to.be.true();
      expect(mockNxt.calledOnce).to.be.false();
    });

    it('should add a logged-in user to the context when the user is verified', async () => {
      const mockReq = {
        ...mockRequest(),
        context: {
          models: {
            User: {
              findByEmail: sinon.stub().returns({ _id: 'some user id' }),
            },
          },
        },
      };
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await verifyUser(mockReq, mockRes, mockNxt);

      expect(mockReq.context).to.include.keys('loggedIn');
      expect(mockNxt.calledOnce).to.be.true();
    });
  });
});
