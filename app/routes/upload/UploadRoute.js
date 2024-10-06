const express=require('express')
const router=express.Router()
const uploadCtrl=require('../../controller/upload/UploadController') 
const multer = require('multer');
const path = require('path');
const archiver = require('archiver');
const fs = require('fs');

const FINGER_UPLOAD_FOLDER = './uploads/fingerprint';

// Ensure the upload directory exists
if (!fs.existsSync(FINGER_UPLOAD_FOLDER)) {
    fs.mkdirSync(FINGER_UPLOAD_FOLDER, { recursive: true });
}

// Storage config for /new route
const uploadStorageNew = multer.diskStorage({
  destination: './uploads/new', 
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploadNew = multer({ storage: uploadStorageNew });

// Storage config for /fingerprint route  
const uploadStorageFingerprint = multer.diskStorage({
  destination: './uploads/fingerprint',
  filename: function(req, file, cb) {
      cb(null,Date.now() + path.extname(file.originalname));
  }
});

const uploadFingerprint = multer({ storage: uploadStorageFingerprint });

router.post('/new', uploadNew.single('file'), uploadCtrl.uploadFile);
// router.post('/new', uploadNew.single('file'), uploadCtrl.uploadFile);

router.post('/fingerprint', uploadFingerprint.single('file'), uploadCtrl.CheckFinger);




router.get('/fingerprints', (req, res) => {
  // Set response headers for zip file download
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=fingerprintdb.zip');

  // Create a zip archive
  const archive = archiver('zip', {
      zlib: { level: 3 } // Sets the compression level
  });

  // Handle errors
  archive.on('error', (err) => {
      throw err;
  });

  // Pipe the archive's output to the response
  archive.pipe(res);

  // Append files from the fingers directory to the zip archive
  archive.directory(FINGER_UPLOAD_FOLDER, false);

  // Finalize the archive (this tells archiver to complete the file and send it)
  archive.finalize();
});

module.exports = router;