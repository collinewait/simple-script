import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, simple script here');
});

const PORT = process.env.PORT || 3000;

app.set('port', PORT);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

export default app;
