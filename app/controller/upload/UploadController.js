
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
    if (!req.file)
      return res.status (401).json ({message: 'Please Upload Photo'});
    
    //req.file match with other from db if not found extract features
      return res.status (200).json ({features:"",message: 'Photo Upload Success'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};
