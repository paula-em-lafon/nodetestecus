import { Router } from 'express'
import User from '../models/users'
import { verifyJWT_MW } from '../middleware/auth'
import { createJWToken } from '../lib/auth'
import bcrypt from 'bcrypt-nodejs'


const auth = Router()

auth.post('/login', (req, res)=> 
  {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
      User.findOne({ username: req.body.username })
      .then(user => {
        if(!user) return res.status(400).json({ message: 'No user' })
		    bcrypt.compare(req.body.password, user.password, (err, result) => {
          if(result){
            return res.status(200)
            .json({
            success: true,
            token: createJWToken({
              sessionData: {user},
              maxAge: 3600
              })
            })
          }
        else{
          return res.status(400).json({ message: 'Bad password' })
        }
      })
    })
  })


auth.get("/verifytoken", verifyJWT_MW);
auth.get('/verifytoken', (req,res) =>{
    res.status(200)
    .json({
      success: true,
      data: req.user
    })
})

auth.post('/register', (req, res) => {
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({ message: 'Missing required fields' })
	}

  findUser(req.body.username)
  .then(() => {
    let user = new User({ username: req.body.username, password: req.body.password })
    user.save()
    .then(() => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(400).json(err)
    })
  })
  .catch((err) => {
    res.status(400).json({ message: err.message })
  })
})


let findUser = (username) => {
    return User.findOne({ username })
      .then(user => {
          if(user) throw new Error('User already exists')
      })
      .catch((err) => {
      throw new Error(err.message)
    })
  }

export default auth