const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('deleteOne', { document: true, query: false }, async function() {
    try {
        if (!this._id) return;

        const bookCount = await Book.countDocuments({ author: this._id });
        
        if (bookCount > 0) {
            throw new Error('This author still has books');
        }
        
    } catch {
        next()
    }
});

module.exports = mongoose.model('Author', authorSchema)