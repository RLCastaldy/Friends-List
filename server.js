const express = require('express');
//initialize mongo
const { MongoClient } = require('mongodb');
const routes = require('./routes');

const app = express();
const port = 3001;

//mongo db address and port
const connectionStringURI = `mongodb://127.0.0.1:27017`;

//create new instance using db connection string
const client = new MongoClient(connectionStringURI);

//creating empty variable for later use
let db;

//DB name
const dbName = 'friendsDB';

//client connect statment
client.connect()
  .then(() => {
    console.log('Connected successfully to MongoDB');
    db = client.db(dbName);

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connection error: ', err.message);
  });

app.use(express.json());
app.use(routes);