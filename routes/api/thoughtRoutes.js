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

// create a new tought and post to
router.post('/', async (req, res) => {
  console.log(req.body);
  try {
    const newThought = await Thought.create(req.body);

    // Get the user ID from the request body
    const userId = req.body.id;

    // Find the user by ID
    const user = await User.findById(userId);
    console.log(user);

    // Push the ID of the new thought to the user's thoughts array
    user.thoughts.push(newThought._id);

    // Save the user to update the thoughts array
    await user.save();

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

// Add a reaction to a thought
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;

    if (!mongoose.Types.ObjectId.isValid(thoughtId)) {
      return res.status(400).json({ message: 'Invalid Thought ID' });
    }

    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    const newReaction = {
      reactionBody: req.body.reactionBody,
      userName: req.body.userName,
    };

    thought.reactions.push(newReaction);
    await thought.save();

    res.status(201).json(thought);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
});

// Delete a reaction from a thought
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const reactionId = req.params.reactionId;

    if (!mongoose.Types.ObjectId.isValid(thoughtId) || !mongoose.Types.ObjectId.isValid(reactionId)) {
      return res.status(400).json({ message: 'Invalid Thought ID or Reaction ID' });
    }

    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Find the index of the reaction to remove
    const index = thought.reactions.findIndex(reaction => reaction._id.toString() === reactionId);

    if (index === -1) {
      return res.status(404).json({ message: 'Reaction not found' });
    }

    // Remove the reaction from the array
    thought.reactions.splice(index, 1);
    await thought.save();

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
});


module.exports = router;