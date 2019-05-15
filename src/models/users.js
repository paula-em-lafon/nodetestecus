import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const userSchema = new mongoose.Schema({
  username: { type: String, unique : true, required : true, dropDups: true},
  password: { type: String, required : true, 
    minlength: [8, 'Password must be longer than 7 character']},
})

userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
      delete ret.password;
      return ret;
  }
});

userSchema.pre('save', function(next) {
  let user = this
  let saltRounds = 5

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err)
      user.password = hash;
      next()
    })
  })
})

const User = mongoose.model('user', userSchema)
export default User