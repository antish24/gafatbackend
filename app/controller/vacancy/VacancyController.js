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
    const lastDoc = await prisma.employee.findFirst ({
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
    const rawData = await prisma.vacancy.findMany ({include:{position:{include:{department:{include:{branch:true}}}}}});
   
    const vacancys = rawData.map (d => {
      return {
        id: d.id,
        IDNO: d.IDNO,
        position: d.position.name,
        department: d.position.department.name,
        branch: d.position.department.branch.name,
        title: d.title,
        vacancyNo: d.vacancyNo,
        vacancyType: d.vacancyType,
        employementType: d.employementType,
        experience: d.experience,
        interviewId: d.interviewId,
        salary: d.salary,
        sector: d.sector,
        status: d.status,
        deadline: d.deadline,
        description: d.description,
        gender: d.gender,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      };
    });
    return res.status (200).json ({vacancys});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.VacancyApplicants = async (req, res) => {
  const {id} = req.query;
  try {
    const RawApplicants = await prisma.applicant.findMany ({orderBy: {
      createdAt: 'desc',
    },
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
        score:emp.totalScore,
        maxScore:emp.maxScore,
        createdAt: emp.createdAt,
      };
    });

    return res.status (200).json ({applicants});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.ApplicantDetail = async (req, res) => {
  const {id} = req.query;
  try {
    const RawApplicant = await prisma.applicant.findUnique ({
      where: {id: id},
      include: {employee: true,vacancy:{include:{interview:true}}},
    });

    const RawApplicantContact = await prisma.employeeContact.findMany({
      where: {employeeId: RawApplicant.employeeId},
    });

    const applicant ={
        score:RawApplicant.totalScore,
        maxScore:RawApplicant.maxScore,
        position: RawApplicant.vacancy.position,
        interview: RawApplicant.vacancy.interview.IDNO,
        IDNO: RawApplicant.employee.IDNO,
        applicantId: RawApplicant.id,
        id: RawApplicant.employee.id,
        name: RawApplicant.employee.fName + " "+ RawApplicant.employee.mName + " "+ (RawApplicant.employee.lName?RawApplicant.employee.lName:''),
        sex: RawApplicant.employee.sex,
        dateOfBirth: RawApplicant.employee.dateOfBirth,
        nationality: RawApplicant.employee.nationality,
        phone:RawApplicantContact[0].phone,
        email:RawApplicantContact[0].email,
        status: RawApplicant.status,
        createdAt: RawApplicant.createdAt,
      };

    return res.status (200).json ({applicant});
  } catch (error) {
    console.log(error)
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
    const IDNO = await GenerateIdNoEmployee ('EMPHR-00001');
    
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
    const d = await prisma.vacancy.findUnique ({where: {IDNO: id},include:{position:{include:{department:{include:{branch:true}}}}}});
    const vacancy ={
        id: d.id,
        IDNO: d.IDNO,
        position: d.position.id,
        department: d.position.department.id,
        branch: d.position.department.branch.id,
        title: d.title,
        vacancyNo: d.vacancyNo,
        vacancyType: d.vacancyType,
        employementType: d.employementType,
        experience: d.experience,
        interviewId: d.interviewId,
        salary: d.salary,
        sector: d.sector,
        status: d.status,
        deadline: d.deadline,
        description: d.description,
        gender: d.gender,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      };

      return res.status (200).json ({vacancy});
  } catch (error) {
    console.log(error)
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
        vacancyType,
        employementType,
        interview: {
          connect: {id: interview},
        },
        position: {
          connect: {id: position},
        },
        gender,
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
        vacancyType,
        employementType,
        interview: {
          connect: {id: interview},
        },
        position: {
          connect: {id: position},
        },
        gender,
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
    console.log (error.message);
    return res.status (500).json ({message:error.message});
  }
};
