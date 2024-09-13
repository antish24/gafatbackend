const db = require ('../../config/db');
// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const bcrypt = require ('bcrypt');
const prisma = new PrismaClient ();

async function GenerateIdNo (prefixname) {
  // Get last id doc
  const lastDoc = await prisma.department.findFirst ({
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

exports.AllDepartment = async (req, res) => {
  try {
    const RawDepartments = await prisma.department.findMany ({
      include: {branch: {select: {name: true}}},
    });

    const departments = RawDepartments.map (dep => {
      return {
        id: dep.id,
        IDNO: dep.IDNO,
        name: dep.name,
        status: dep.status,
        createdAt: dep.createdAt,
        updatedAt: dep.updatedAt,
        branch: dep.branch.name,
      };
    });

    return res.status (200).json ({departments});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.FindDepartment = async (req, res) => {
  const {branchId} = req.query;
  try {
    const departments = await prisma.department.findMany ({
      where: {branchId: branchId},
    });
    return res.status (200).json ({departments});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewDepartment = async (req, res) => {
  const {name, branch} = req.body;

  try {
    const IDNO = await GenerateIdNo ('DPHR-00001');
    await prisma.department.create ({
      data: {
        IDNO: IDNO,
        name,
        branch: {
          connect: {id: branch},
        },
      },
    });

    return res.status (200).json ({message: 'Branch Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};
