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

async function GenerateIdNoEmployee (prefixname) {
  // Get last id doc
  const lastDoc = await prisma.employee.findFirst ({where:{status:"Pending"},
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

exports.VacancyApplicants = async (req, res) => {
  const {id} = req.query;
  try {
    const RawApplicants = await prisma.applicant.findMany ({
      where: {vacancyId: id},
      include: {employee: true},
    });

    const applicants = RawApplicants.map (emp => {
      return {
        id: emp.id,
        IDNO: emp.employee.IDNO,
        fName: emp.employee.fName,
        mName: emp.employee.mName,
        lName: emp.employee.lName,
        sex: emp.employee.sex,
        dateOfBirth: emp.employee.dateOfBirth,
        nationality: emp.employee.nationality,
        status: emp.status,
        createdAt: emp.createdAt,
      };
    });

    return res.status (200).json ({applicants});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.AddApplicant = async (req, res) => {
  const {
    fName,
    lName,
    mName,
    dateOfBirth,
    sex,
    nationality,
    city,
    subCity,
    wereda,
    kebele,
    houseNo,
    phone,
    email,
    otherPhone,
    vacancy,
  } = req.body;
  try {
    const IDNO = await GenerateIdNoEmployee ('EMVAC-00001');
    
    const employeeID = await prisma.employee.create ({
      data: {
        IDNO: IDNO,
        fName,
        lName,
        mName,
        dateOfBirth,
        sex,
        nationality,
        status: 'Pending',
      },
    });

    await prisma.employeeAddress.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        city,
        subCity,
        wereda,
        kebele,
        houseNo,
      },
    });

    await prisma.employeeContact.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        phone,
        email,
        otherPhone,
      },
    });

    await prisma.applicant.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        vacancy: {connect: {id: vacancy}},
        IDNO:IDNO
      },
    });

    return res.status (200).json ({message: 'Employee Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

exports.VacancyDetail = async (req, res) => {
  const {id} = req.query;
  try {
    const vacancy = await prisma.vacancy.findUnique ({where: {IDNO: id}});
    return res.status (200).json ({vacancy});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.CloseVacancy = async (req, res) => {
  const {id} = req.query;
  try {
    await prisma.vacancy.update ({
      where: {IDNO: id},
      data: {
        status: 'Closed',
      },
    });
    return res.status (200).json ({message: 'Vacancy Closed'});
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
        interview: {
          connect: {id: interview},
        },
        gender,
        location,
        sector,
        experience,
        deadline,
        vacancyNo: parseInt (vacancyNo),
        salary: parseInt (salary),
        description,
      },
    });
    return res.status (200).json ({message: 'Vacancy Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

exports.UpdateVacancy = async (req, res) => {
  const {
    title,
    IDNO,
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
    await prisma.vacancy.update ({
      where: {IDNO: IDNO},
      data: {
        title,
        position,
        vacancyType,
        employementType,
        interview: {
          connect: {id: interview},
        },
        gender,
        location,
        sector,
        experience,
        deadline,
        vacancyNo: parseInt (vacancyNo),
        salary: parseInt (salary),
        description,
      },
    });
    return res.status (200).json ({message: 'Vacancy Updated'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};
