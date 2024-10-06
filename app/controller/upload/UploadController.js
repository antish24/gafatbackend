const fs = require ('fs').promises;
const path = require('path');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file)
      return res.status (401).json ({message: 'Please Upload Photo'});
    else return res.status (200).json ({message: 'Photo Upload Success'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

exports.CheckFinger = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(401).json({ message: 'Please Upload Photo' });
    }

    // Directory path for stored fingerprints
    const fingerprintDir = './uploads/fingerprint';

    // Function to compare two files
    async function compareFiles(file1, file2) {
      try {
        const content1 = await fs.readFile(file1, 'utf-8');
        const content2 = await fs.readFile(file2, 'utf-8');
        return content1 === content2;
      } catch (err) {
        throw new Error('Error reading files: ' + err.message);
      }
    }

    // Function to compare the uploaded file with all files in the directory
    async function compareWithAllFiles(uploadedFile) {
      try {
        // Read all files in the directory
        const files = await fs.readdir(fingerprintDir);

        // Iterate through the files and compare
        for (const file of files) {
          const filePath = path.join(fingerprintDir, file);
          if (filePath === uploadedFile) {
            continue;
          }
          // Compare the uploaded file with each file in the directory
          const isMatch = await compareFiles(filePath, uploadedFile);
          if (isMatch) {
            return file; // Return the matched file's name if a match is found
          }
        }

        return null; // Return null if no match is found
      } catch (err) {
        throw new Error('Error comparing with all files: ' + err.message);
      }
    }

    // Compare the uploaded file with all stored fingerprints
    const matchedFile = await compareWithAllFiles(req.file.path);

    if (matchedFile) {
      await fs.unlink(req.file.path);
      return res.status(400).json({name:req.file, message: `Match found with file: ${matchedFile}` });
    } else {
      return res.status(200).json({name:req.file, message: `No matching file found.` });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
