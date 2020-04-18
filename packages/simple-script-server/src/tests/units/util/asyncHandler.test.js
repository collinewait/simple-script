/* eslint-disable no-unused-vars */
import sinon from 'sinon';
import chai from 'chai';
import dirtyChai from 'dirty-chai';

import asyncHandler from '../../../util/asyncHandler';

const { expect } = chai;

chai.use(dirtyChai);

describe('Async handler', () => {
  const mockRequest = () => ({});
  const mockResponse = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    res.send = sinon.stub().returns(res);
    return res;
  };

  it('should not return an error if no errors thrown', async () => {
    const mockReq = mockRequest();
    const mockRes = mockResponse();
    const someFunc = async (req, res) => res.status(200).json({});

    await asyncHandler(someFunc)(mockReq, mockRes);

    expect(mockRes.status.calledWith(200)).to.be.true();
  });

  it('should return status of 404 if error returned has kind of ObjectId', async () => {
    const mockReq = mockRequest();
    const mockRes = mockResponse();
    const someFunc = async (req, res) => {
      const errorObj = {
        kind: 'ObjectId',
        message: 'some error message',
      };
      throw errorObj;
    };
    await asyncHandler(someFunc)(mockReq, mockRes);

    expect(mockRes.status.calledWith(404)).to.be.true();
  });

  it('should return Duplicates are not allowed when MongoError has a code of 11000', async () => {
    const mockReq = mockRequest();
    const mockRes = mockResponse();
    const someFunc = async (req, res) => {
      const errorObj = {
        name: 'MongoError',
        code: 11000,
      };
      throw errorObj;
    };
    await asyncHandler(someFunc)(mockReq, mockRes);

    expect(mockRes.status.calledWith(400)).to.be.true();
    expect(mockRes.send.calledWith({
      status: 400,
      message: 'Duplicates are not allowed',
    })).to.be.true();
  });
});
