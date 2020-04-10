import express from 'express';
import cors from 'cors';

import router from './routes';

const app = express();

app.use(cors());

// Body parser configuration
app.use(express.json());

// Router configuration
app.use(router);

app.get('/', (req, res) => {
  res.send('Hello, simple script here');
});

const PORT = process.env.PORT || 3000;

app.set('port', PORT);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

export default app;
