const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

async function GenerateIdNo (prefixname) {
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

exports.AllEmployee = async (req, res) => {
  try {
    const rawEmployees = await prisma.employeeWorkDetail.findMany ({
      include: {
        employee: true,
        position: {include: {department: {include: {branch: true}}}},
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const employees = rawEmployees.map (emp => {
      return {
        IDNO: emp.employee.IDNO,
        fName: emp.employee.fName,
        mName: emp.employee.mName,
        lName: emp.employee.lName,
        sex: emp.employee.sex,
        dateOfBirth: emp.employee.dateOfBirth,
        nationality: emp.employee.nationality,
        status: emp.employee.status,
        registered: emp.employee.createdAt,
        employementType: emp.employementType,
        shift: emp.shift,
        salary: emp.salary,
        startDate: emp.startDate,
        position: emp.position.name,
        department:emp.position.department.name,
        branch:emp.position.department.branch.name,
      };
    });
    return res.status (200).json ({employees});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.AllEmployeeNames = async (req, res) => {
  try {
    const rawEmployees = await prisma.employeeWorkDetail.findMany ({
      include: {
        employee: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const employees = rawEmployees.map (emp => {
      return {
        id: emp.id,
        empId: emp.employee.id,
        IDNO: emp.employee.IDNO,
        fName: emp.employee.fName,
        mName: emp.employee.mName,
        lName: emp.employee.lName,
      };
    });
    return res.status (200).json ({employees});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.FindEmployeeNames = async (req, res) => {
  const {position}=req.query
  try {
    const rawEmployees = await prisma.employeeWorkDetail.findMany ({
      where:{
        positionId:position
      },
      include: {
        employee: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const employees = rawEmployees.map (emp => {
      return {
        id: emp.id,
        IDNO: emp.employee.IDNO,
        fName: emp.employee.fName,
        mName: emp.employee.mName,
        lName: emp.employee.lName,
      };
    });
    return res.status (200).json ({employees});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewEmployee = async (req, res) => {
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
    position,
    employementType,
    shift,
    salary,
    startDate,
    agreement,
    bankName,
    bankAccount,
    TIN,
    religion,
    maritalStatus,
    ethnicGroup,
    bloodGroup,
    medicalReport,
    fingerPrintReport,
    profilePhoto,
    IDF,
    IDB,
  } = req.body;
  try {
    const IDNO = await GenerateIdNo ('EMPHR-00001');

    const employeeID = await prisma.employee.create ({
      data: {
        IDNO: IDNO,
        fName,
        lName,
        mName,
        dateOfBirth,
        sex,
        nationality,
      },
    });

    await prisma.employeeProfile.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        profile: profilePhoto.name,
        IDFront: IDF.name,
        IDBack: IDB.name,
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

    await prisma.leaveBalance.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        balance:16,
      },
    });

    await prisma.employeeWorkDetail.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        position: {connect: {id: position}},
        employementType,
        shift,
        salary,
        startDate,
        agreement: agreement.name,
        bankName,
        bankAccount,
        TIN,
      },
    });

    await prisma.employeeRelatedInfo.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        religion,
        maritalStatus,
        ethnicGroup,
        bloodGroup,
        medicalReport: medicalReport.name,
        fingerPrintReport: fingerPrintReport.name,
      },
    });
    return res.status (200).json ({message: 'Employee Created'});
  } catch (error) {
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};


exports.HireEmployee = async (req, res) => {
  const {
    position,
    employementType,
    shift,
    salary,
    startDate,
    agreement,
    bankName,
    bankAccount,
    TIN,
    religion,
    maritalStatus,
    ethnicGroup,
    bloodGroup,
    medicalReport,
    fingerPrintReport,
    profilePhoto,
    IDF,
    IDB,
    empId
  } = req.body;
  try {

    await prisma.applicant.updateMany ({
      where:{employeeId:empId},
      data: {
        status:'Hired'
      },
    });

    const employeeID = await prisma.employee.update ({
      where:{id:empId},
      data:{status:'Active'}
    });

    await prisma.employeeProfile.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        profile: profilePhoto.name,
        IDFront: IDF.name,
        IDBack: IDB.name,
      },
    });

    await prisma.leaveBalance.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        balance:16,
      },
    });

    await prisma.employeeWorkDetail.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        position: {connect: {id: position}},
        employementType,
        shift,
        salary,
        startDate,
        agreement: agreement.name,
        bankName,
        bankAccount,
        TIN,
      },
    });

    await prisma.employeeRelatedInfo.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        religion,
        maritalStatus,
        ethnicGroup,
        bloodGroup,
        medicalReport: medicalReport.name,
        fingerPrintReport: fingerPrintReport.name,
      },
    });
    console.log('ggod')
    return res.status (200).json ({message: 'Employee Hired'});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};
