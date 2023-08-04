import express from 'express';
import process from 'node:process';
import bodyParser from 'body-parser';
import cors from 'cors';

import { connect } from 'mongoose';
import userRouter from './routers/UserRouter.js'
import placeRouter from './routers/placeRouter.js'
import todosRouter from './routers/todos.js';
// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;


const mongoDBURI = process.env.MONGODB_URI;
await connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

app.use(bodyParser.json());
const corsOptions = {
  origin: 'https://wanderlist-itinerary.onrender.com',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));

app.use(userRouter);
app.use(placeRouter)
app.use('/todos', todosRouter);



app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
