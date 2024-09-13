// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const bcrypt = require ('bcrypt');
const prisma = new PrismaClient ();

function generatePassword () {
  const capitalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const smallLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '0123456789';

  let password = '';

  // Generate at least one character from each category
  password += getRandomCharacter (capitalLetters);
  password += getRandomCharacter (smallLetters);
  password += getRandomCharacter (numbers);
  password += getRandomCharacter (symbols);

  // Generate the remaining characters randomly
  for (let i = 4; i < 8; i++) {
    const characterType = getRandomInt (4); // 0: capital letter, 1: small letter, 2: number, 3: symbol

    switch (characterType) {
      case 0:
        password += getRandomCharacter (capitalLetters);
        break;
      case 1:
        password += getRandomCharacter (smallLetters);
        break;
      case 2:
        password += getRandomCharacter (numbers);
        break;
      case 3:
        password += getRandomCharacter (symbols);
        break;
    }
  }

  return password;
}

function getRandomCharacter (characterSet) {
  const randomIndex = getRandomInt (characterSet.length);
  return characterSet.charAt (randomIndex);
}

function getRandomInt (max) {
  return Math.floor (Math.random () * Math.floor (max));
}

async function generateIdNo () {
  // Get last id doc
  const lastDoc = await prisma.user.findFirst ({
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
  });

  if (!lastDoc) return 'SHBU-001';
  // Extract code and number
  const code = lastDoc.IDNO.split ('-')[0];
  let number = lastDoc.IDNO.split ('-')[1];

  // Increment number
  number = parseInt (number) + 1;

  // Pad with zeros
  number = number.toString ().padStart (3, '0');

  // Return new id
  return code + '-' + number;
}

exports.AllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany ();
    return res.status (200).json ({users});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.UserDetail = async (req, res) => {
  const {id} = req.query;
  try {
    const user = await prisma.user.findMany ({where: {IDNO: id}});
    return res.status (200).json ({user: user[0]});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.UpdateDetail = async (req, res) => {
  const {fullname, gender, access, phone, email} = req.body;
  try {
    await prisma.user.update ({
      where: {email: email},
      data: {fullname, gender, access, phone},
    });
    return res.status (200).json ({message: 'User Updated'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.DeleteUser = async (req, res) => {
  const {id} = req.query;
  try {
    await prisma.user.updateMany ({
      where: {IDNO: id},
      data: {
        status:"Deleted"
      },
    });
    return res.status (200).json ({message: 'User Deleted'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.BanUser = async (req, res) => {
  const {id,status} = req.query;
  try {
    await prisma.user.updateMany ({
      where: {IDNO: id},
      data: {
        status:status
      }
    });
    return res.status (200).json ({message: 'User Status Updated'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewUser = async (req, res) => {
  const {fullname, gender, access, phone, email} = req.body;
  try {
    const userExist = await prisma.user.findUnique ({
      where: {
        email: email,
      },
    });
    if (userExist) return res.status (401).json ({message: 'User Email Exist'});

    const password = '123456';
    const IdNo = await generateIdNo ();
    const hashPassword = await bcrypt.hash (password, 10);

    await prisma.user.create ({
      data: {
        fullname: fullname,
        IDNO: IdNo,
        gender: gender,
        access: access,
        phone: phone,
        email: email,
        password: hashPassword,
        token: '',
        status: 'Active',
      },
    });
    return res.status (200).json ({message: 'User Created'});
  } catch (error) {
    console.log (error);
  }
};
