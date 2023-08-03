import express from 'express';
import Todo from '../models/Todo.js';
import mongoose from 'mongoose';

const router = express.Router();

// GET /todos
// router.get('/', async (req, res) => {
//   try {
//     const todos = await Todo.find();
//     res.json(todos);
//   } catch (error) {
//     console.error('Error fetching todos:', error);
//     res.status(500).json({ message: 'Unable to fetch todos' });
//   }
// });

// GET /todos
router.get('/', async (req, res) => {
  try {
    const { userID, place, day } = req.query;

    // Build the query based on the provided query parameters
    const query = {};
    if (userID) {
      query.userID = userID;
    }
    if (place) {
      query.place = place;
    }
    if (day) {
      query.day = parseInt(day, 10); // Convert the day string to a number
    }

    const todos = await Todo.find(query);
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Unable to fetch todos' });
  }
});


// POST /todos
router.post('/', async (req, res) => {
  const { task, time, userID, place, day } = req.body;
  if (!task) {
    return res.status(400).json({ message: 'Task is required' });
  }

  try {
    const newTodo = new Todo({
      task,
      time: time || null,
      completed: false,
      userID,
      place,
      day,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Unable to create todo' });
  }
});

// PUT /todos/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { task, time, completed } = req.body;

  try {
    // Validate that the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.task = task || todo.task;
    todo.time = time || todo.time;
    todo.completed = completed ?? todo.completed;

    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Unable to update todo' });
  }
});

// DELETE /todos/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Validate that the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(deletedTodo);
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Unable to delete todo' });
  }
});

export default router;
