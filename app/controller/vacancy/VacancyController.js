const db = require ('../../config/db');
// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const bcrypt = require ('bcrypt');
const prisma = new PrismaClient ();

async function GenerateIdNo (prefixname) {
  // Get last id doc
  const lastDoc = await prisma.vacancy.findFirst ({
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


exports.AllVacancy = async (req, res) => {
  try {
    const vacancys = await prisma.vacancy.findMany ();
    return res.status (200).json ({vacancys});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.VacancyStatus = async (req, res) => {
  const {id, status} = req.query;
  try {
    await prisma.user.updateMany ({
      where: {IDNO: id},
      data: {
        status: status,
      },
    });
    return res.status (200).json ({message: 'User Status Updated'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewVacancy = async (req, res) => {
  const {
    title,
    position,
    vacancyType,
    employementType,
    interview,
    gender,
    location,
    sector,
    experience,
    deadline,
    vacancyNo,
    salary,
    description,
  } = req.body;
  try {
    const IDNO = await GenerateIdNo ('VAHR-00001');
    await prisma.vacancy.create ({
      data: {
        IDNO: IDNO,
        title,
        position,
        vacancyType,
        employementType,
        interview,
        gender,
        location,
        sector,
        experience,
        deadline,
        vacancyNo:parseInt(vacancyNo),
        salary:parseInt(salary),
        description,
      },
    });
    return res.status (200).json ({message: 'Vacancy Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};
