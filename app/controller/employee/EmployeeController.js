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

async function GenerateDisciplineIdNo (prefixname) {
  // Get last id doc
  const lastDoc = await prisma.employeeDiscipline.findFirst ({
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

exports.EmployeePersonalInfo = async (req, res) => {
  const {id}=req.query;
  try {
    const employee = await prisma.employeeProfile.findFirst ({
      where:{employee:{IDNO:id}},
      include: {
        employee: true,
      },
    }); 

    const contact = await prisma.employeeContact.findFirst ({
      where:{employee:{IDNO:id}},
    });
    
    const address = await prisma.employeeAddress.findFirst ({
      where:{employee:{IDNO:id}},
    });

    const workdetail = await prisma.employeeWorkDetail.findFirst ({
      where:{employee:{IDNO:id}},include:{position:{include:{department:{include:{branch:true}}}}}
    });

    const relatedInfo = await prisma.employeeRelatedInfo.findFirst ({
      where:{employee:{IDNO:id}}
    });

    const infos ={ 
        IDNO: employee.employee.IDNO,
        IDB: employee.IDBack,
        IDF: employee.IDFront,
        profile: employee.profile,

        fName: employee.employee.fName,
        mName: employee.employee.mName,
        lName: employee.employee.lName,

        sex: employee.employee.sex,
        dateOfBirth: employee.employee.dateOfBirth,
        nationality: employee.employee.nationality,

        email: contact.email,
        phone: contact.phone,
        otherPhone: contact.otherPhone,

        city: address.city,
        subCity: address.subCity,
        wereda: address.wereda,
        kebele: address.kebele,
        houseNo: address.houseNo,

        //work detail
        branch: workdetail.position.department.branch.name,
        department: workdetail.position.department.name,
        position: workdetail.position.name,
        employementType: workdetail.employementType,
        shift: workdetail.shift,
        startDate: workdetail.startDate,
        salary: workdetail.salary,
        agreement: workdetail.agreement,
        bankAccount: workdetail.bankAccount,
        bankName: workdetail.bankName,
        TIN: workdetail.TIN,

        //relatedinfo
        bloodGroup: relatedInfo.bloodGroup,
        maritalStatus: relatedInfo.maritalStatus,
        religion: relatedInfo.religion,
        ethnicGroup: relatedInfo.ethnicGroup,
        medicalReport: relatedInfo.medicalReport,
        fingerPrintReport: relatedInfo.fingerPrintReport,
        familyBg: relatedInfo.familyBg,
        emergencyContactName: relatedInfo.emergencyContactName,
        emergencyContactPhone: relatedInfo.emergencyContactPhone,
        emergencyContactRelation: relatedInfo.emergencyContactRelation,

      };

      return res.status (200).json ({employee:infos});
  } catch (error) {
    console.log(error)
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

    const requiredFields = [
      'fName',
      'mName',
      'dateOfBirth',
      'sex',
      'nationality',
      'city',
      'subCity',
      'wereda',
      'kebele',
      'houseNo',
      'phone',
      'position',
      'employementType',
      'shift',
      'salary',
      'startDate',
      'agreement',
      'medicalReport',
      'fingerPrintReport',
      'profilePhoto',
      'IDF',
      'IDB',
    ];
    
    // Check for missing required fields
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(401).json({ message: `Missing Input: ${field}` });
      }
    }

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

    await prisma.employeeFingerPrint.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        features:fingerPrintReport,
      },
    });

    await prisma.employeeProfile.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        profile: profilePhoto,
        IDFront: IDF,
        IDBack: IDB,
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
        agreement: agreement,
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
        medicalReport: medicalReport,
        fingerPrintReport: fingerPrintReport,
      },
    });
    return res.status (200).json ({message: 'Employee Created'});
  } catch (error) {
    console.log(error)
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

    await prisma.employeeFingerPrint.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        features:fingerPrintReport,
      },
    });

    await prisma.employeeProfile.create ({
      data: {
        employee: {connect: {id: employeeID.id}},
        profile: profilePhoto,
        IDFront: IDF,
        IDBack: IDB,
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
        agreement: agreement,
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
        medicalReport: medicalReport,
        fingerPrintReport: fingerPrintReport,
      },
    });
    console.log('ggod')
    return res.status (200).json ({message: 'Employee Hired'});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

exports.NewAgreement = async (req, res) => {
  const {title, articles,position} = req.body;

  try {
    const IDNO = await GenerateIdNo ('AGHR-00001');
      const agreement=await prisma.agreement.create ({
        data: {
          IDNO: IDNO,
          title,
          position: {
            connect: {id: position},
          },
        },
      })

      articles.forEach (async(article) => {
        await prisma.articles.create ({
          data: {
            name: article.articleTitle,
            description:article.description,
            agreement: {
              connect: {id: agreement.id},
            },
          },
        });
      })

    return res.status (200).json ({message: 'Agreement Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

exports.AllAgreement = async (req, res) => {
  try {
    const agreements = await prisma.agreement.findMany ({include:{position:{include:{department:{include:{branch:true}}}}}});
    return res.status (200).json ({agreements});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.UpdateAgreement = async (req, res) => {
  const {title, articles,id,position} = req.body;

  try {
      const agreement=await prisma.agreement.update ({
        where: {id: id},
        data: {
          title,
          position: {
            connect: {id: position},
          },
        },
      })

      await prisma.articles.deleteMany({where:{agreementId:agreement.id}})

      articles.forEach (async(question) => {
        await prisma.articles.create ({
          data: {
            name: question.name,
            description:question.description,
            agreement: {
              connect: {id: agreement.id},
            },
          },
        });
      })

    return res.status (200).json ({message: 'Agreement Updated'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};


exports.AgreementDetail = async (req, res) => {
  const {id} = req.query;
  try {
    const agreement = await prisma.agreement.findUnique ({where: {id: id},include:{position:{include:{department:{include:{branch:true}}}}}});
    const articles = await prisma.articles.findMany({where: {agreementId: agreement.id}});

    const list={
      IDNO:agreement.IDNO,
      IDNO:agreement.createdAt,
      IDNO:agreement.id,
      branch:agreement.position.department.branch.id,
      department:agreement.position.department.id,
      position:agreement.position.id,
      title:agreement.title,
      status:agreement.status,
    }
    return res.status (200).json ({agreement:list,articles});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewDiscipline = async (req, res) => {
  const {incidentDate, description,attachment,employeeWork,witnesses} = req.body;
  try {
    const IDNO = await GenerateDisciplineIdNo ('DIHR-00001');
      const discipline=await prisma.employeeDiscipline.create ({
        data: {
          IDNO: IDNO,
          incidentDate,
          description,
          attachment,
          employeeWork: {
            connect: {id: employeeWork},
          },
        },
      })

      witnesses.forEach (async(d) => {
        await prisma.witnesses.create ({
          data: {
            employeeDiscipline: {
              connect: {id: discipline.id},
            },
            employeeWork: {
              connect: {id: d},
            },
          },
        });
      })

    return res.status (200).json ({message: 'Discipline Report Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

exports.AllDiscipline = async (req, res) => {
  try {
    const rawList = await prisma.employeeDiscipline.findMany ({include:{employeeWork:{include:{employee:true,position:{include:{department:{include:{branch:true}}}}}}}});
    const list = rawList.map (emp => {
      return {
        id: emp.id,
        DIDNO: emp.IDNO,
        attachemnt: emp.attachment,
        status: emp.status,
        createdAt: emp.createdAt,
        
        IDNO: emp.employeeWork.employee.IDNO,
        fName: emp.employeeWork.employee.fName,
        mName: emp.employeeWork.employee.mName,
        lName: emp.employeeWork.employee.lName,
        sex: emp.employeeWork.employee.sex,
        position: emp.employeeWork.position.name,
        department: emp.employeeWork.position.department.name,
        branch: emp.employeeWork.position.department.branch.name,
      };
    });
    return res.status (200).json ({list});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.DisciplineDetail = async (req, res) => {
  const {id}=req.query
  try {
    const emp = await prisma.employeeDiscipline.findUnique ({where:{id:id},include:{employeeWork:{include:{employee:true,position:{include:{department:{include:{branch:true}}}}}}}});
    const list = {
        id: emp.id,
        DIDNO: emp.IDNO,
        attachemnt: emp.attachment,
        status: emp.status,
        createdAt: emp.createdAt,
        incidentDate: emp.incidentDate,
        description: emp.description,
        
        IDNO: emp.employeeWork.employee.IDNO,
        fName: emp.employeeWork.employee.fName,
        mName: emp.employeeWork.employee.mName,
        lName: emp.employeeWork.employee.lName,
        sex: emp.employeeWork.employee.sex,
        position: emp.employeeWork.position.name,
        department: emp.employeeWork.position.department.name,
        branch: emp.employeeWork.position.department.branch.name,
      };

    return res.status (200).json ({list});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};