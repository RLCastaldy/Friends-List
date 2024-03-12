const router = require('express').Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {User, Thought} = require('../../models');

 // GET all users
router.get('/', async (req, res) => {
  try {
      const user = await User.find().populate("thoughts").populate("friends");
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

// update user by Id
router.put('/:id', async (req, res) => {
  try {
    const { userName, emailAddress } = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { userName, emailAddress }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'No user found with this id!' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Object ID!' });
    }

    const user = await User.findOneAndDelete({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this Object ID!' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
});

// Add a friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: 'Invalid user or friend ID' });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Check if the friend is already in the user's friend list
    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'Friend already in the list' });
    }

    // Add the friend to the user's friend list
    user.friends.push(friend._id);
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
});

// Remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: 'Invalid user or friend ID' });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Check if the friend is in the user's friend list
    if (!user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'Friend not in the list' });
    }

    // Remove the friend from the user's friend list
    user.friends = user.friends.filter(f => f.toString() !== friend._id.toString());
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
});


module.exports = router;