import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());

app.get('/', (req, res) => {
  return res.json({
    message: 'QwikCollab server is up and running',
  });
});

export default app;
