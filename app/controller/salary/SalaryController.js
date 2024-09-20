const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

exports.AllComponents = async (req, res) => {
  try {
    const all = await prisma.salaryComponent.findMany ({
      orderBy: {createdAt: 'desc'},
    });
    return res.status (200).json ({all});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.AllStructure = async (req, res) => {
  try {
    const all = await prisma.salaryStructureForm.findMany ({
      orderBy: {createdAt: 'desc'},
    });
    return res.status (200).json ({all});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewComponents = async (req, res) => {
  const {
    type,
    name,
    pension,
    tax,
    semiTaxType,
    minNonTaxable,
    conditionType,
    applicableAfter,
  } = req.body;
  try {
    await prisma.salaryComponent.create ({
      data: {
        type: type,
        name,
        pension,
        tax,
        semiTaxType,
        minNonTaxable: parseInt (minNonTaxable),
        conditionType,
        applicableAfter: parseInt (applicableAfter),
      },
    });

    return res.status (200).json ({message: 'Component Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewStructure = async (req, res) => {
  const {structure, name} = req.body;
  try {
    const findsalaryStructureForm = await prisma.salaryStructureForm.findMany ({
      where: {
        name: name,
      },
    });
    if (findsalaryStructureForm.length > 0) {
      return res.status (401).json ({message: 'Structure Name Exist'});
    }

    const salaryStructureForm = await prisma.salaryStructureForm.create ({
      data: {
        name: name,
      },
    });

    structure.forEach (async data => {
      await prisma.salaryStructure.create ({
        data: {
          salaryComponent: {
            connect: {id: data.id},
          },
          amount: parseInt (data.amount),
          salaryStructureForm: {
            connect: {id: salaryStructureForm.id},
          },
        },
      });
    });
    return res.status (200).json ({message: 'Structure Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.UpdateStructure = async (req, res) => {
  const {structure, name,id} = req.body;
  try {
    const salaryStructureForm = await prisma.salaryStructureForm.update ({
      where:{id,id},
      data: {
        name: name,
      },
    });

    await prisma.salaryStructure.deleteMany({where:{salaryStructureFormId:salaryStructureForm.id}})
    
    structure.forEach (async data => {
      await prisma.salaryStructure.create ({
        data: {
          salaryComponent: {
            connect: {id: data.id},
          },
          amount: parseInt (data.amount),
          salaryStructureForm: {
            connect: {id: salaryStructureForm.id},
          },
        },
      });
    });
    return res.status (200).json ({message: 'Structure Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.StructureDetail = async (req, res) => {
  const {id} = req.query;
  try {
    const structure = await prisma.salaryStructureForm.findUnique ({where: {id: id}});
    const components = await prisma.salaryStructure.findMany({where: {salaryStructureFormId: structure.id}});

    return res.status (200).json ({structure,components});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};


exports.AssignStructure = async (req, res) => {
  const {employee,structure} = req.body;
  try {
    console.log(employee,structure)
    employee.forEach (async emp => {
      await prisma.employeeSalaryStructure.create({data: {
        employeeWorkDetail: {
          connect: {id: emp},
        },
        salaryStructureForm: {
          connect: {id: structure},
        },
      }});
    })
    
    return res.status (200).json ({message:"Salary Structure Assigned"});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.AllAssignStructure = async (req, res) => {
  try {
    const list=await prisma.employeeSalaryStructure.findMany({
      include:{employeeWorkDetail:{include:{employee:true}},salaryStructureForm:true}
    });

    const all = list.map (emp => {
      return {
        IDNO: emp.employeeWorkDetail.employee.IDNO,
        fName: emp.employeeWorkDetail.employee.fName,
        mName: emp.employeeWorkDetail.employee.mName,
        lName: emp.employeeWorkDetail.employee.lName,
        sex: emp.employeeWorkDetail.employee.sex,
        structure: emp.salaryStructureForm.name,
        createdAt: emp.createdAt,
        status: emp.status,
        id: emp.id,
      };
    });

    return res.status (200).json ({all});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};
