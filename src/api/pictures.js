import multer from 'multer';
import path from 'path';
import { Router } from 'express'
import { picture } from '../models/pictures'
import { verifyJWT_MW } from '../middleware/auth'
import mongoose from 'mongoose'
var gm = require('gm').subClass({imageMagick: true});

const pics = Router()
// Set The Storage Engine for uploads.


const storage = multer.diskStorage({
    destination: './storage/media',
    filename: function(req, file, cb){
      req.body.time = Date.now();
      req.body.databasepicname = file.fieldname + '-' + req.body.time + path.extname(file.originalname);
      cb(null,req.body.databasepicname);
    }
  });
  
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb){
  checkFileType(file, cb);
  }
});

  // Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

function createThumb(filename, instance){
  gm(path.resolve('./storage/media/' + filename))
    .resize(120, null)
    .write(path.resolve('./storage/media/thumb' + '-' + filename), function (err) {
      if (!err) {
        console.log('thumbnail created successfully')
        instance.updateOne({thumbname: 'thumb' + '-' + filename,
                  thumbswitch: true},
          () => {
            if(!err){  
              console.log('thumb updated')
              return
            }
            else{
              console.log(err)
              return
            }
          })
        }
      else{console.log(err)}
    })
  };

pics.post("/upload", verifyJWT_MW);
pics.post('/upload', (req, res) => {
    upload.single('image')(req, res, (err) => {
      if(err){
        return res.status(500).json({ message: err });
      } else {
        if(req.file == undefined){
            return res.status(500).json({ message: 'upload a valid file!' });
        } else {
          let pic = new picture({
            title: req.body.title,
            description: req.body.description,
            filename: req.body.databasepicname,
            user: req.user.user._id
          });
          pic.save()
          .then(() => res.status(201).json({ message: pic }))
          .catch(() => {console.log('Something went wrong')})
          .then(createThumb(req.body.databasepicname, pic, () => {console.log("DONE")}))
          };
        }
      });
  });

pics.get("/", verifyJWT_MW);
pics.get('/', (req, res) => {
  picture.find({})
  .exec((err, pics) => {
    if(err){
      return res.status(500).json({ message: err });
    }
    else{
      res.status(201).json({ message: pics })};
    })
  });


export default pics;