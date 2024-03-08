const router = require('express').Router();
const {User, Thought} = require('../../models');

 // GET all users
router.get('/api/users', async (req, res) => {
  try {
      const users = await User.find();
      res.json(users);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// POST a new user
router.post('/api/users', async (req, res) => {
  console.log(req.body);
  try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});


module.exports = router;