import express from 'express';
import process from 'node:process';
import bodyParser from 'body-parser';
import cors from 'cors';

import { connect } from 'mongoose';
import userRouter from './routers/UserRouter.js'
import placeRouter from './routers/placeRouter.js'
import todosRouter from './routers/todos.js';

const app = express();
const PORT = process.env.PORT || 10000;
app.set('port', PORT);
// Correct the MongoDB connection string here
const mongoDBURI = 'mongodb+srv://wanderlister:test123@cluster0.yz1ofnf.mongodb.net/?retryWrites=true&w=majority';

await connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

app.use(bodyParser.json());
app.use(cors());

app.use(userRouter);
app.use(placeRouter)
app.use('/todos', todosRouter);



app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
