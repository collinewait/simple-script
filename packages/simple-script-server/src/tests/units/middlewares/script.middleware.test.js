import sinon from 'sinon';
import chai from 'chai';
import dirtyChai from 'dirty-chai';

import { findScript } from '../../../middlewares/script.middleware';

const { expect } = chai;

chai.use(dirtyChai);

describe('Script middleware', () => {
  context('findScript', () => {
    const mockRequest = () => ({
      params: {
        scriptId: '234wrongId',
      },
    });
    const mockResponse = () => {
      const res = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      return res;
    };
    const mockNext = () => sinon.stub().returns({});

    it('should return a script not found message with a wrong script id', async () => {
      const mockReq = mockRequest();
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await findScript(mockReq, mockRes, mockNxt);
      expect(mockRes.status.calledWith(404)).to.be.true();
      expect(
        mockRes.json.calledWith({
          status: 404,
          message: 'script not found with id: 234wrongId',
        }),
      ).to.be.true();
      expect(mockNxt.calledOnce).to.be.false();
    });

    it('should return a status of 404 when the script is not found', async () => {
      const mockReq = {
        ...mockRequest(),
        params: {
          ...mockRequest().params,
          scriptId: '5e94233f01c11c1462c164b4',
        },
        context: {
          models: {
            Script: {
              findSingleScript: sinon.stub().returns(null),
            },
          },
        },
      };
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await findScript(mockReq, mockRes, mockNxt);
      expect(mockRes.status.calledWith(404)).to.be.true();
      expect(mockNxt.calledOnce).to.be.false();
    });

    it('should add a script to the context when it is found', async () => {
      const mockReq = {
        ...mockRequest(),
        params: {
          ...mockRequest().params,
          scriptId: '5e94233f01c11c1462c164b4',
        },
        context: {
          models: {
            Script: {
              findSingleScript: sinon
                .stub()
                .returns({ id: '5e94233f01c11c1462c164b4' }),
            },
          },
        },
      };
      const mockRes = mockResponse();
      const mockNxt = mockNext();

      await findScript(mockReq, mockRes, mockNxt);
      expect(mockNxt.calledOnce).to.be.true();
      expect(mockReq.context).to.include.keys('script');
    });
  });
});
