/* eslint-disable no-underscore-dangle */
import sinon from 'sinon';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import chaiAsPromised from 'chai-as-promised';

import {
  createScript,
  getAllScripts,
  getSingleScript,
  updateScript,
  deleteScript,
  updateScriptOutput,
} from '../../../controllers/script.controller';

const { expect } = chai;

chai.use(chaiAsPromised);
chai.use(dirtyChai);

describe('Script controllers', () => {
  const invalidOpsMsg = 'request contains invalid operations';
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

  context('updateScript', () => {
    const mockRequest = () => ({
      body: {
        operations: [],
      },
    });
    const mockResponse = () => {
      const res = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      return res;
    };

    it('should throw an error when no operations sent', async () => {
      const mockReq = mockRequest();
      const mockRes = mockResponse();

      await expect(updateScript(mockReq, mockRes)).to.be.rejectedWith('request missing operations');
    });

    it('should throw an error when operations are not defined', async () => {
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          operations: null,
        },
      };
      const mockRes = mockResponse();

      await expect(updateScript(mockReq, mockRes)).to.be.rejectedWith('request missing operations');
    });

    it('should throw an error when an operation is invalid', async () => {
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          operations: ['some-invalid-script'],
        },
      };
      const mockRes = mockResponse();

      await expect(updateScript(mockReq, mockRes)).to.be.rejectedWith(invalidOpsMsg);
    });

    it('should return an updated script with a 200 status code', async () => {
      const updatingScript = 'DoThisThing(string)';
      const scriptToUpdate = {
        _id: 'some-id',
        runResults: [],
        script: 'DoThisThing(string)\nDoThisThing(string)',
      };
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          operations: ['DoThisThing(string)', 'DoThisThing(string)'],
        },
        context: {
          script: {
            save: sinon.stub().returns({ ...scriptToUpdate, script: updatingScript }),
          },
        },
      };
      const mockRes = mockResponse();

      await updateScript(mockReq, mockRes);

      expect(mockRes.status.calledWith(200)).to.be.true();
      expect(
        mockRes.json.calledWith({
          message: 'success',
          status: 200,
          data: {
            id: scriptToUpdate._id,
            runResults: scriptToUpdate.runResults,
            script: updatingScript,
          },
        }),
      ).to.be.true();
    });


    it('should not update runResults when the scripts are the same', async () => {
      const updatingScript = 'DoThisThing(string)';
      const scriptToUpdate = {
        _id: 'some-id',
        runResults: [19],
        script: 'DoThisThing(string)',
      };
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          operations: ['DoThisThing(string)'],
        },
        context: {
          script: {
            save: sinon.stub().returns({ ...scriptToUpdate, script: updatingScript }),
          },
        },
      };
      const mockRes = mockResponse();

      await updateScript(mockReq, mockRes);

      expect(mockRes.status.calledWith(200)).to.be.true();
      expect(
        mockRes.json.calledWith({
          message: 'success',
          status: 200,
          data: {
            id: scriptToUpdate._id,
            runResults: scriptToUpdate.runResults,
            script: updatingScript,
          },
        }),
      ).to.be.true();
    });

    it('should update runResults when the scripts are different', async () => {
      const updatingScript = 'DoThisThing(string)\nDoThisThing(string)';
      const scriptToUpdate = {
        _id: 'some-id',
        runResults: [19],
        script: 'DoThisThing(string)',
      };
      const mockReq = {
        ...mockRequest(),
        body: {
          ...mockRequest().body,
          operations: ['DoThisThing(string)', 'DoThisThing(string)'],
        },
        context: {
          script: {
            save: sinon.stub().returns({
              ...scriptToUpdate,
              script: updatingScript,
              runResults: [],
            }),
          },
        },
      };
      const mockRes = mockResponse();

      await updateScript(mockReq, mockRes);

      expect(mockRes.status.calledWith(200)).to.be.true();
      expect(
        mockRes.json.calledWith({
          message: 'success',
          status: 200,
          data: {
            id: scriptToUpdate._id,
            runResults: [],
            script: updatingScript,
          },
        }),
      ).to.be.true();
    });
  });

  context('deleteScript', () => {
    const mockRequest = () => ({
      context: {
        script: {
          remove: sinon.stub().returns({}),
        },
      },
    });
    const mockResponse = () => {
      const res = {};
      res.sendStatus = sinon.stub().returns(res);
      return res;
    };

    it('should return 204 after deleting a script', async () => {
      const mockReq = mockRequest();
      const mockRes = mockResponse();

      await deleteScript(mockReq, mockRes);

      expect(mockRes.sendStatus.calledWith(204)).to.be.true();
    });
  });

  context('updateScriptOutput', () => {
    const mockRequest = () => ({
      context: {
        script: {
          _id: 'script-id',
          runResults: 'run-results',
          script: 'DoThisThing(string)\nDoThatThing(integer)\nDoTheOtherThing(float)',
          save: sinon.stub().returns({ _id: 'some-script-with-updated-runResults-in-this-object' }),
        },
      },
    });
    const mockResponse = () => {
      const res = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      return res;
    };

    it('should return 200 after executing the script', async () => {
      const mockReq = mockRequest();
      const mockRes = mockResponse();

      await updateScriptOutput(mockReq, mockRes);

      expect(mockRes.status.calledWith(200)).to.be.true();
    });

    it('should throw an error when the script has an operation with length 1', async () => {
      const mockReq = {
        context: {
          script: {
            script: '1',
          },
        },
      };
      const mockRes = mockResponse();

      await expect(updateScriptOutput(mockReq, mockRes)).to.be.rejectedWith('Random Error');
    });

    it('should throw an error when the script has an invalid operation', async () => {
      const mockReq = {
        context: {
          script: {
            script: 'this-is-invalid',
          },
        },
      };
      const mockRes = mockResponse();

      await expect(updateScriptOutput(mockReq, mockRes)).to.be.rejectedWith('Not Valid');
    });
  });
});
