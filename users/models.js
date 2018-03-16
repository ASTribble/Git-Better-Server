const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const UserSchema = mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true
    },
    firstName: {
        type: String, 
        default:''
    },
    lastName: {
        type: String, 
        default:''
    },
    password: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    questions: [{
        question: String,
        answer: String, 
        next: Number, 
        timesAsked: {type:Number, default:0},
        correct: {type:Number, default:0}
    }],
    head: Number
});


UserSchema.methods.serialize = function () {
    return {
        id: this._id,
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName
    };
}

UserSchema.methods.validatePassword = function (password){
    return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 12);
}

const User = mongoose.model('User', UserSchema);

module.exports = { User }