import mongoose from 'mongoose'
import User from './users'

const pictureSchema = new mongoose.Schema({
    title: {type: String, maxlength: [50, 'Title must be longer than 50 characters']},
    description: {type: String},
    filename: {type: String},
    thumbname:{type: String},
    thumbswitch:{type: Boolean, default: false},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

var picture = mongoose.model('Picture', pictureSchema);

exports.picture = picture;
