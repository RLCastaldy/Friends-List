const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      uique: true,
      trim: true,
    }, emailAddress: {
      type: String,
      require: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Invalid email address format',
      },
    }, thoughts: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Thought'
      }
  ], friends: [
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
]
  },
);

// Create a virtual property called friendCount
userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;