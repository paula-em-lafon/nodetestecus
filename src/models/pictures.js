import mongoose from 'mongoose'
var url_signature = require('../middleware/url-signature/index');
import User from './users'



const pictureSchema = new mongoose.Schema({
    title: {type: String, maxlength: [50, 'Title must be longer than 50 characters']},
    description: {type: String},
    filename: {type: String},
    thumbname:{type: String},
    thumbswitch:{type: Boolean, default: false},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

pictureSchema.statics.activePictureUrl = function(data) {
    return data.map(function(picture) {
        return{
            _id: picture._id,
            title: picture.title,
            description: picture.description,
            filename:url_signature.urlSign(
                'http://localhost:8010/api/pictures/file/?filename=' + picture.filename),
            thumbname:url_signature.urlSign(
                'http://localhost:8010/api/pictures/file/?filename=' + picture.thumbname),
            user: picture.user
        }
    })
}

var picture = mongoose.model('Picture', pictureSchema);

exports.picture = picture;
