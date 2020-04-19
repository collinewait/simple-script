import sinon from 'sinon';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import chaiAsPromised from 'chai-as-promised';

import {
  createScript,
  getAllScripts,
  getSingleScript,
} from '../../../controllers/script.controller';

const { expect } = chai;

chai.use(chaiAsPromised);
chai.use(dirtyChai);

describe('Script controllers', () => {
  context('createScript', () => {
    const mockRequest = () => ({
      body: {
        operations: [],
      },
      context: {
        loggedIn: {
          userId: 'some-user-id',
        },
      },
    });
    const mockResponse = () => {
      const res = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      return res;
    };

    const invalidOpsMsg = 'request contains invalid operations';
    const script = { script: 'script-here', _id: 'some-id-here', runResults: 'some-script-output' };

    it('should return request missing operations message when no operations sent', async () => {
      const mockReq = mockRequest();
      const mockRes = mockResponse();
      await expect(createScript(mockReq, mockRes)).to.be.rejectedWith('request missing operations');
    });

    it('should return a script when a single operation is sent', async () => {
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          operations: ['DoThisThing(string)'],
        },
        context: {
          ...mockRequest().context,
          models: {
            Script: {
              create: sinon.stub().returns(script),
            },
          },
        },
      };
      const mockRes = mockResponse();

      await createScript(mockReq, mockRes);

      expect(mockRes.status.calledWith(201)).to.be.true();
    });

    it('should throw an error when the single script sent is invalid', async () => {
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          operations: ['DoThisThing(string-invalid'],
        },
        context: {
          ...mockRequest().context,
          models: {
            Script: {
              create: sinon.stub().returns(script),
            },
          },
        },
      };
      const mockRes = mockResponse();

      await expect(createScript(mockReq, mockRes)).to.be.rejectedWith(invalidOpsMsg);
    });

    it('should return a script when a more than one operations are sent', async () => {
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          operations: ['DoThisThing(string)', 'DoThisThing(string)'],
        },
        context: {
          ...mockRequest().context,
          models: {
            Script: {
              create: sinon.stub().returns(script),
            },
          },
        },
      };
      const mockRes = mockResponse();

      await createScript(mockReq, mockRes);

      expect(mockRes.status.calledWith(201)).to.be.true();
    });

    it('should throw an error when any of the operations is invalid', async () => {
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          operations: ['DoThisThing(string)', 'DoThisThing(string-Invalid', 'DoThisThing(string)'],
        },
        context: {
          ...mockRequest().context,
          models: {
            Script: {
              create: sinon.stub().returns(script),
            },
          },
        },
      };
      const mockRes = mockResponse();

      await expect(createScript(mockReq, mockRes)).to.be.rejectedWith(invalidOpsMsg);
    });

    it('should throw an error when the last operations is invalid', async () => {
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          operations: ['DoThisThing(string)', 'DoThisThing(string-Invalid'],
        },
        context: {
          ...mockRequest().context,
          models: {
            Script: {
              create: sinon.stub().returns(script),
            },
          },
        },
      };
      const mockRes = mockResponse();

      await expect(createScript(mockReq, mockRes)).to.be.rejectedWith(invalidOpsMsg);
    });
  });

  context('getAllScripts', () => {
    const mockRequest = () => ({
      context: {
        loggedIn: {
          userId: 'some-user-id',
        },
        models: {
          Script: {
            findByUser: sinon.stub().returns({ _id: 'user-scripts-in-this-object' }),
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

    it('should return user scripts when they are available', async () => {
      const mockReq = mockRequest();
      const mockRes = mockResponse();

      await getAllScripts(mockReq, mockRes);

      expect(mockRes.status.calledWith(200)).to.be.true();
    });

    it('should return 404 when no scripts found', async () => {
      const mockReq = {
        ...mockRequest(),
        context: {
          ...mockRequest().context,
          models: {
            Script: {
              findByUser: sinon.stub().returns(null),
            },
          },
        },
      };
      const mockRes = mockResponse();

      await getAllScripts(mockReq, mockRes);

      expect(mockRes.status.calledWith(404)).to.be.true();
    });
  });

  context('getSingleScript', () => {
    const mockRequest = () => ({
      context: {
        script: {
          _id: 'script-id',
          runResults: 'run-results',
          script: 'some-script',
        },
      },
    });
    const mockResponse = () => {
      const res = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      return res;
    };

    it('should return 200 when getting a single script', async () => {
      const mockReq = mockRequest();
      const mockRes = mockResponse();

      await getSingleScript(mockReq, mockRes);

      expect(mockRes.status.calledWith(200)).to.be.true();
    });
  });
});
