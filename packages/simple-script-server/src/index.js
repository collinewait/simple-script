import express from 'express';
import cors from 'cors';

import router from './routes';
import connectDb from './db';
import Context from './middlewares/context.middleware';

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

connectDb().then(async () => {
  const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
  });
}).catch(error => {
  console.log(error);
});

export default app;
