import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const router = express.Router();

// REGISTER NEW USER
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const newUser = new User({
      username: username,
      password: password,
      email: email
    });

    await newUser.save();

    res.status(201).json({
      message: 'New User Added',
      data: newUser
    });
  } catch (error) {
    res.status(500).send('Error in adding new User');
  }
});


// GET ALL USER
router.get("/users", async (req, res) => {

  const name = await User.find();
  res.send({ data: name })

});


// LOGIN

const secretKey = 'secret';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user with the given username
    const user = await User.findOne({ username: username });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate a JWT token with user information as payload
    const token = jwt.sign(
      {
        userID: user._id,
        username: user.username,
        email: user.email,
      },
      secretKey
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

router.get('/protected', async (req, res) => {
  const authorization = req.headers.authorization;

  // To check value of Authorization header
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authorization.split(' ')[1];

  try {
    // Verify the token
    const payload = jwt.verify(token, secretKey);

    // Access the userID from the token payload
    const userID = payload.userID;

    // You can use the userID to fetch user-specific data or perform any other actions
    res.status(200).json( userID );
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//  GET ALL THE USERS
// Get the User Name
router.get("/users", async (req, res) => {

  const name = await User.find();


  res.send({ data: name })

})
export default router;