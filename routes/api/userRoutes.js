const router = require('express').Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {User, Thought} = require('../../models');

 // GET all users
router.get('/', async (req, res) => {
  try {
      const user = await User.find();
      res.json(user);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Get one user by Object ID
router.get('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Object ID!' });
    }

    const user = await User.findById(req.params.id).populate('thoughts');

    if (!user) {
      return res.status(404).json({ message: 'No user found with this Object ID!' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new user
router.post('/', async (req, res) => {
  console.log(req.body);
  try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});


module.exports = router;