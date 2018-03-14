const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    }
});

QuestionSchema.methods.serialize = function(){
    return {
        id: this._id,
        quetions: this.question,
        answer: this.answer
    }
}

const Question = mongoose.model('Question', QuestionSchema);

module.exports = {Question};