const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 2, // Minimum length of 2 characters
        maxlength: 279 // Maximum length of 279 characters to allow for a total of 280 characters
    },
    createdAt: {
        type: Date,
        default: Date.now,
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    username: {
        type: String,
        required: true
    },
    reactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reaction'
        }
    ]
});

// Define a getter method for formatting the timestamp
thoughtSchema.path('timestamp').get(function(timestamp) {
    // Customize the timestamp formatting here
    return timestamp.toISOString(); // Example: Format timestamp as ISO string
});

// Create a virtual property called reactionCount
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;