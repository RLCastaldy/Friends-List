const router = require('express').Router();
const friendsRoutes = require('./friendsRoutes');

router.use('/friends', friendsRoutes);

module.exports = router;