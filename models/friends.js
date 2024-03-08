const { Schema, model } = require('mongoose');

const friendsSchema = new Schema(
  {
    friendName: {
      type: String,
      required: true,
    },
    thought: {
        type: String,
        required:true,
    }
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const Friends = model('friends', friendsSchema);

module.exports = Friends;