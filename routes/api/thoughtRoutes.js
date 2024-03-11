const router = require('express').Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {User, Thought} = require('../../models');

 // GET all thoughts
router.get('/', async (req, res) => {
  try {
      const thought = await Thought.find();
      res.json(thought);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Get one thought by Object ID
router.get('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Object ID!' });
    }

    const thought = await Thought.findById(req.params.id).populate('thoughts');

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this Object ID!' });
    }

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new user
router.post('/', async (req, res) => {
  console.log(req.body);
  try {
      const newThought = await Thought.create(req.body);
      res.status(201).json(newThought);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// update user
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Object ID!' });
    }

    const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedThought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }

    res.status(200).json(updatedThought);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Object ID!' });
    }

    const thought = await Thought.findOneAndDelete({ _id: req.params.id });

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this Object ID!' });
    }

    res.status(200).json({ message: 'Thought deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
});


module.exports = router;