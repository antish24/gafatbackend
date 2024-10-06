// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const bcrypt = require ('bcrypt');
const prisma = new PrismaClient ();

async function GenerateIdNo (prefixname) {
  // Get last id doc
  const lastDoc = await prisma.docFile.findFirst ({
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
  });

  if (!lastDoc) return prefixname;
  // Extract code and number
  const code = lastDoc.IDNO.split ('-')[0];
  let number = lastDoc.IDNO.split ('-')[1];

  // Increment number
  number = parseInt (number) + 1;

  // Pad with zeros
  number = number.toString ().padStart (5, '0');

  // Return new id
  return code + '-' + number;
}

exports.AllDocType = async (req, res) => {
  try {
    const docTypes = await prisma.docType.findMany ();
    return res.status (200).json ({docTypes});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.AllDoc = async (req, res) => {
  try {
    const docs = await prisma.docFile.findMany ({include: {type: true}});
    return res.status (200).json ({docs});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewDocType = async (req, res) => {
  const {name} = req.body;
  try {
    await prisma.docType.create ({
      data: {
        name,
      },
    });
    return res.status (200).json ({message: 'New Doc Type Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

exports.NewDocFile = async (req, res) => {
  const {name, type, attachment, author, docRef} = req.body;
  try {
    const findRef = await prisma.docFile.findUnique ({where: {docRef: docRef}});
    if (findRef) {
      return res.status (400).json ({message: 'Doc Ref Already Exists'});
    }
    const IDNO = await GenerateIdNo ('DOC-00001');
    await prisma.docFile.create ({
      data: {
        IDNO: IDNO,
        name,
        typeId: type,
        attachment,
        author,
        docRef,
      },
    });
    return res.status (200).json ({message: 'New Doc File Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};
