import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  // ... Your existing code for user registration ...
});

router.get('/users', async (req, res) => {
  const name = await User.find();
  res.send({ data: name });
});

// Use process.env.JWT_SECRET instead of hard-coded secretKey
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
      process.env.JWT_SECRET // Use the JWT_SECRET from .env
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
    // Verify the token using JWT_SECRET from .env
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Access the userID from the token payload
    const userID = payload.userID;

    // You can use the userID to fetch user-specific data or perform any other actions
    res.status(200).json(userID);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
