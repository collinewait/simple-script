import chaiHttp from 'chai-http';
import { use, request, expect } from 'chai';
import app from '../..';
import models from '../../models';
import { operations, singleUser } from '../seed/user.seed';

use(chaiHttp);

const SCRIPTS_ROUTE = '/api/v1/scripts';
const SIGNUP_ROUTE = '/api/auth/signup';

describe(SCRIPTS_ROUTE, () => {
  let token;
  beforeEach(async () => {
    await models.Script.deleteMany({});
    await models.User.deleteMany({});
    const res = await request(app).post(SIGNUP_ROUTE).send(singleUser);
    token = res.body.token;
  });

  context('POST', () => {
    it('should create a script with a single operation when valid details are submitted', async () => {
      const res = await request(app)
        .post(SCRIPTS_ROUTE)
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: [operations.doThis] });
      expect(res.status).eql(201);
      expect(res.body.message).eql('success');
    });

    it('should create a script with multiple operation when valid details are submitted', async () => {
      const res = await request(app)
        .post(SCRIPTS_ROUTE)
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: [operations.doThis, operations.doThat, operations.doTheOther] });
      expect(res.status).eql(201);
      expect(res.body.message).eql('success');
    });

    it('should return an error when a script with similar operations already exists', async () => {
      await request(app)
        .post(SCRIPTS_ROUTE)
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: [operations.doThis] });
      const res = await request(app)
        .post(SCRIPTS_ROUTE)
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: [operations.doThis] });
      expect(res.status).eql(400);
      expect(res.body.message).eql('Duplicates are not allowed');
    });

    it('should return an error when no operations are specified', async () => {
      const res = await request(app)
        .post(SCRIPTS_ROUTE)
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: [] });
      expect(res.status).eql(400);
      expect(res.body.message).eql('request missing operations');
    });

    it('should return an error when an invalid operation is used', async () => {
      const res = await request(app)
        .post(SCRIPTS_ROUTE)
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: ['someInvalidOperation'] });
      expect(res.status).eql(400);
      expect(res.body.message).eql('request contains invalid operations');
    });

    it('should return an error when any of the operations is invalid', async () => {
      const res = await request(app)
        .post(SCRIPTS_ROUTE)
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: [operations.doThis, operations.doThat, 'inValidOpTheOther'] });
      expect(res.status).eql(400);
      expect(res.body.message).eql('request contains invalid operations');
    });

    it('should return an error when the token is missing', async () => {
      const res = await request(app)
        .post(SCRIPTS_ROUTE)
        .send({ operations: [operations.doThis] });
      expect(res.status).eql(401);
      expect(res.body.message).eql('Invalid credentials, please login');
    });

    it('should return an error when the token is invalid', async () => {
      const res = await request(app)
        .post(SCRIPTS_ROUTE)
        .set('Authorization', 'Bearer invalidTokeneyJhbGciOib20iLCJpYXQi')
        .send({ operations: [operations.doThis] });
      expect(res.status).eql(401);
      expect(res.body.message).eql('Invalid credentials, please login');
    });
  });

  context('GET', () => {
    it('should return all scripts created', async () => {
      await request(app)
        .post(SCRIPTS_ROUTE)
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: [operations.doThis] });

      const res = await request(app)
        .get(SCRIPTS_ROUTE)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).eql(200);
      expect(res.body.message).eql('success');
    });
  });

  context(`${SCRIPTS_ROUTE}/:scriptId`, () => {
    context('GET', () => {
      it('should return a single script when it exists', async () => {
        const createdScript = await request(app)
          .post(SCRIPTS_ROUTE)
          .set('Authorization', `Bearer ${token}`)
          .send({ operations: [operations.doThis] });

        const res = await request(app)
          .get(`${SCRIPTS_ROUTE}/${createdScript.body.data.id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).eql(200);
        expect(res.body.message).eql('success');
      });

      it('should return an error when a script with that id is not found', async () => {
        const res = await request(app)
          .get(`${SCRIPTS_ROUTE}/wrongid098hu`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).eql(404);
        expect(res.body.message).eql('script not found with id: wrongid098hu');
      });
    });


    context('PUT', () => {
      it('should return an updated script when a valid script is sent', async () => {
        const createdScript = await request(app)
          .post(SCRIPTS_ROUTE)
          .set('Authorization', `Bearer ${token}`)
          .send({ operations: [operations.doThis] });

        const res = await request(app)
          .put(`${SCRIPTS_ROUTE}/${createdScript.body.data.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ script: `${operations.doThat}\n${operations.doThis}` });
        expect(res.status).eql(200);
        expect(res.body.message).eql('success');
        expect(res.body.data.script).eql(`${operations.doThat}\n${operations.doThis}`);
      });

      it('should return an error if no script is sent', async () => {
        const createdScript = await request(app)
          .post(SCRIPTS_ROUTE)
          .set('Authorization', `Bearer ${token}`)
          .send({ operations: [operations.doThis] });

        const res = await request(app)
          .put(`${SCRIPTS_ROUTE}/${createdScript.body.data.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ script: '' });
        expect(res.status).eql(400);
        expect(res.body.message).eql('request contains invalid operations');
      });

      it('should return an error if a script is sent with any invalid operations', async () => {
        const createdScript = await request(app)
          .post(SCRIPTS_ROUTE)
          .set('Authorization', `Bearer ${token}`)
          .send({ operations: [operations.doThis] });

        const res = await request(app)
          .put(`${SCRIPTS_ROUTE}/${createdScript.body.data.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ script: 'invalidOpsHere' });
        expect(res.status).eql(400);
        expect(res.body.message).eql('request contains invalid operations');
      });

      it('should return an error if a script with the specified id does not exist', async () => {
        const res = await request(app)
          .put(`${SCRIPTS_ROUTE}/fakeIdhere`)
          .set('Authorization', `Bearer ${token}`)
          .send({ script: 'invalidOpsHere' });
        expect(res.status).eql(404);
        expect(res.body.message).eql('script not found with id: fakeIdhere');
      });
    });

    context('PATCH', () => {
      it('should return a script with updated runResults', async () => {
        const createdScript = await request(app)
          .post(SCRIPTS_ROUTE)
          .set('Authorization', `Bearer ${token}`)
          .send({ operations: [operations.doThis] });
        expect(createdScript.body.data.runResults).eql([]);

        const res = await request(app)
          .patch(`${SCRIPTS_ROUTE}/${createdScript.body.data.id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).eql(200);
        expect(res.body.message).eql('success');
        expect(res.body.data.runResults).eql([19]);
      });

      it('should return an error if a script with a provided id does not exist', async () => {
        const res = await request(app)
          .patch(`${SCRIPTS_ROUTE}/fakeId`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).eql(404);
        expect(res.body.message).eql('script not found with id: fakeId');
      });
    });

    context('DELETE', () => {
      it('should return 204 after deleting a script', async () => {
        const createdScript = await request(app)
          .post(SCRIPTS_ROUTE)
          .set('Authorization', `Bearer ${token}`)
          .send({ operations: [operations.doThis] });

        const res = await request(app)
          .delete(`${SCRIPTS_ROUTE}/${createdScript.body.data.id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).eql(204);
      });

      it('should return an error if a script with a provided id does not exist', async () => {
        const res = await request(app)
          .delete(`${SCRIPTS_ROUTE}/fakeId`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).eql(404);
        expect(res.body.message).eql('script not found with id: fakeId');
      });
    });
  });
});
