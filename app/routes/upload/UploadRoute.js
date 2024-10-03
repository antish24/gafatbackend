const express=require('express')
const router=express.Router()
const UploadController=require('../../controller/upload/UploadController') 

const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
const upload = multer({ storage });

router.post('/new',upload.single('file'),UploadController.uploadFile)
router.post('/fingerprint',upload.single('file'),UploadController.CheckFinger)

module.exports=router