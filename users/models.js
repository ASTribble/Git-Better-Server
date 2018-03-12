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
    }
});


UserSchema.methods.serialize = function () {
    return {
        id: this._id,
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName
    };
}

const User = mongoose.model('User', UserSchema);









module.exports = { User }