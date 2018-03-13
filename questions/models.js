const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
        unique: true
    },
    answer: {
        type: String,
        required: true,
        unique: true
    }
});

QuestionSchema.methods.serialize = function(){
    return {
        id: this._id,
        text: this.text,
        answer: this.answer
    }
}

const Question = mongoose.model('Question', QuestionSchema);

module.exports = {Question};