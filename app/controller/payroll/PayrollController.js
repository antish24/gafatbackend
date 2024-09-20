const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

exports.AllGeneratedPayroll = async (req, res) => {
  try {
    const all = await prisma.payroll.findMany ({
      orderBy: {createdAt: 'desc'},
      include: {project: true},
    });
    return res.status (200).json ({all});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.GeneratedPayrollList = async (req, res) => {
  const {id} = req.query;
  try {
    const all = await prisma.employeePayroll.findMany ({
      orderBy: {createdAt: 'desc'},
      where: {payrollId: id},
      include: {employeeWorkDetail: {include: {employee: true,position:{include:{department:{include:{branch:true}}}}}}},
    });

    const list = all.map (emp => {
      return {
        IDNO: emp.employeeWorkDetail.employee.IDNO,
        fName: emp.employeeWorkDetail.employee.fName,
        mName: emp.employeeWorkDetail.employee.mName,
        lName: emp.employeeWorkDetail.employee.lName,
        sex: emp.employeeWorkDetail.employee.sex,
        dateOfBirth: emp.employeeWorkDetail.employee.dateOfBirth,
        position: emp.employeeWorkDetail.position.name,
        department: emp.employeeWorkDetail.position.department.name,
        branch: emp.employeeWorkDetail.position.department.branch.name,
        createdAt: emp.createdAt,
        createdAt: emp.createdAt,
        status: emp.status,
        id: emp.id,
        salary: emp.salary,
        totalEarning: emp.totalEarning,
        grossSalary: emp.grossSalary,
        totalDeduction: emp.totalDeduction,
        netSalary: emp.netSalary,
        id: emp.id,
      };
    });

    return res.status (200).json ({list});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.GenerateNewPayroll = async (req, res) => {
  const {from, to, project, basedOn} = req.body;
  try {
    console.log (project);

    const employeeProject = await prisma.employeeProject.findMany ({
      where: {projectId: project},
      include: {workDetail: {include: {employee: true}}},
    });

    // const employeeTimeSheet = '5000';
    const empSalaryStructure = [];

    for (const emp of employeeProject) {
      const salaryStructure = await prisma.employeeSalaryStructure.findMany ({
        where: {
          employeeWorkDetailId: emp.workDetailId,
        },
        include: {
          employeeWorkDetail: {select: {salary: true}},
          salaryStructureForm: {
            include: {
              salaryStructure: {include: {salaryComponent: true}},
            },
          },
        },
      });

      empSalaryStructure.push (salaryStructure);
    }

    const newPayroll = await prisma.payroll.create ({
      data: {
        generatedBy: 'ish',
        basedOn: 'Project',
        project: {connect: {id: project}},
        from: '2024-01-20T11:37:36.294Z',
        to: '2024-02-20T11:37:36.294Z',
        ApprovedBy: '',
      },
    });

    const employeePayroll = [];

    for (const list of empSalaryStructure) {
      let earnings = 0;
      let deductions = 0;
      let grossSalary = 0;
      let netSalary = 0;
      let salary = 0;
      
      list.forEach (async(emp) => {
        salary=emp.employeeWorkDetail.salary
        emp.salaryStructureForm.salaryStructure.forEach (d => {
          if (d.salaryComponent.type === 'Earning') {
            earnings += d.amount;
          }
          if (d.salaryComponent.type === 'Deduction') {
            deductions += d.amount;
          }
        });
        grossSalary=parseInt(salary)+parseInt(earnings)
        netSalary=parseInt(grossSalary)-parseInt(deductions)

        const salaryStructure = await prisma.employeePayroll.create ({
          data: {
            payroll: {connect: {id: newPayroll.id}},
            employeeWorkDetail: {connect: {id: emp.employeeWorkDetailId}},
            salary: salary.toString(),
            totalEarning: earnings.toString (),
            grossSalary: grossSalary.toString(),
            totalDeduction: deductions.toString (),
            netSalary: netSalary.toString(),
          },
        });

        employeePayroll.push (salaryStructure);
      
      });
    }

    return res
      .status (200)
      .json ({message: 'Payroll Created', all: employeePayroll});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};
