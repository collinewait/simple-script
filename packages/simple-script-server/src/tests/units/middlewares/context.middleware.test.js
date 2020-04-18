import { expect } from 'chai';
import sinon from 'sinon';

import context from '../../../middlewares/context.middleware';

describe('Context middleware', () => {
  const mockRequest = () => ({});
  const mockResponse = () => () => ({});
  const next = sinon.stub().returns({});

  it('should add a context object to the request', () => {
    const mockReq = mockRequest();
    const mockRes = mockResponse();

    context(mockReq, mockRes, next);

    expect(mockReq).to.include.keys('context');
  });
});
