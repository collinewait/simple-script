import express from 'express';
import cors from 'cors';

import router from './routes';
import connectDb from './db';
import Context from './middlewares/context.middleware';
import logger from './util/winston';

const app = express();

app.use(cors());
app.use(express.json());
app.use(Context);
app.use(router);


app.get('/', (req, res) => {
  res.send('Hello, simple script here');
});

const PORT = process.env.PORT || 3000;

app.set('port', PORT);

let server;
connectDb().then(async () => {
  server = app.listen(app.get('port'), () => {
    logger.info(`Express running → PORT ${server.address().port}`);
  });
}).catch(error => {
  logger.error(`Error connecting to mongo db: ${error.message}, Stack: ${error.stack}`);
});

process.on('SIGINT', () => {
  logger.info('Received a kill signal, shutting down the server gracefully.');
  server.close(() => {
    logger.info('The server is shut down gracefully');
  });
});

export default app;
