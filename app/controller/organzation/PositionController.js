const db = require ('../../config/db');
// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const bcrypt = require ('bcrypt');
const prisma = new PrismaClient ();

async function GenerateIdNo (prefixname) {
  // Get last id doc
  const lastDoc = await prisma.position.findFirst ({
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

exports.AllPosition = async (req, res) => {
  try {
    const RawPositions = await prisma.position.findMany ({
      include:{department:{select:{name:true,branch:{select:{name:true}}}}}
    });

    const positions = RawPositions.map (position => {
      return {
        id: position.id,
        IDNO: position.IDNO,
        name: position.name,
        status: position.status,
        createdAt: position.createdAt,
        updatedAt: position.updatedAt,
        department: position.department.name,
        branch: position.department.branch.name,
      };
    });

    return res.status (200).json ({positions});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewPostion = async (req, res) => {
  const {name, department} = req.body;

  try {
    const IDNO = await GenerateIdNo ('POHR-00001');
    await prisma.position.create ({
      data: {
        IDNO: IDNO,
        name,
        department: {connect: {id: department}},
      },
    });

    return res.status (200).json ({message: 'Position Created'});
  } catch (error) {
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};


exports.FindPosition = async (req, res) => {
  const {departmentId} = req.query;
  try {
    const positions = await prisma.position.findMany ({
      where: {departmentId: departmentId},
    });
    return res.status (200).json ({positions});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};