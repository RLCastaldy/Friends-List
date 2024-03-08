const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');
const models = require('./models');

const app = express();
const port = 3001;

app.use(express.json());
app.use(routes);
app.use(models);

db.once('open', () => {
  app.listen(port, () => {
    console.log(`API server running on port ${port}!`);
  });
});
