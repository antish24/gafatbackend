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
      include: {
        employeeWorkDetail: {
          include: {
            employee: true,
            position: {include: {department: {include: {branch: true}}}},
          },
        },
      },
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
        basicSalary: emp.employeeWorkDetail.salary,
        salary: emp.salary,
        totalEarning: emp.totalEarning,
        incomeTax: emp.incomeTax,
        employeePension: emp.employeePension,
        employerPension: emp.employerPension,
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
          employeeWorkDetail: true,
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
        basedOn: basedOn,
        project: {connect: {id: project}},
        from: from,
        to: to,
        ApprovedBy: '',
      },
    });

    const employeePayroll = [];

    for (const list of empSalaryStructure) {
      let taxableearnings = 0;
      let nonTaxableearnings = 0;
      let pensionearnings = 0;

      let deductions = 0;

      let grossSalary = 0;
      let taxableSalary = 0;
      let pensionableSalary = 0;

      let netSalary = 0;
      let salary = 0;

      let employeeTotalDays = 0;
      let incomeTaxs = 0;
      let employeePension = 0;
      let employerPension = 0;

      list.forEach (async emp => {
        startDate = emp.employeeWorkDetail.startDate;
        employeeTotalDays = Math.floor (
          (Date.now () - startDate.getTime ()) / 86400000
        );
        salary = parseInt (emp.employeeWorkDetail.salary);
        grossSalary = parseInt (emp.employeeWorkDetail.salary);
        emp.salaryStructureForm.salaryStructure.forEach (d => {
          if (d.salaryComponent.type === 'Earning') {
            if (employeeTotalDays > d.salaryComponent.applicableAfter) {
              switch (d.salaryComponent.tax) {
                case 'Yes':
                  taxableearnings += d.amount;
                  break;
                case 'No':
                  nonTaxableearnings += d.amount;
                  break;
                case 'Semi':
                  switch (d.salaryComponent.semiTaxType) {
                    case 'Fixed':
                      if (d.amount > d.salaryComponent.minNonTaxable) {
                        taxableearnings += d.amount;
                      } else {
                        nonTaxableearnings += d.amount;
                      }
                      break;
                    case 'Percent':
                      if (
                        d.amount >
                        salary / (d.salaryComponent.minNonTaxable * 100)
                      ) {
                        taxableearnings += d.amount;
                      } else {
                        nonTaxableearnings += d.amount;
                      }
                      break;

                    default:
                      break;
                  }
                  break;
                default:
                  break;
              }
              switch (d.salaryComponent.pension) {
                case 'Yes':
                  pensionearnings += d.amount;
                  break;
                default:
                  break;
              }
            }
          }
          taxableSalary = taxableearnings + salary;
          pensionableSalary = pensionearnings + salary;
          grossSalary = taxableearnings + nonTaxableearnings + salary;

          if (d.salaryComponent.type === 'Deduction') {
            if (employeeTotalDays > d.salaryComponent.applicableAfter) {
              switch (d.salaryComponent.conditionType) {
                case 'Deduct':
                  deductions += d.amount;
                  break;
                case 'IncomeTax':
                  if (taxableSalary > 601 && taxableSalary < 1650) {
                    incomeTaxs = taxableSalary * 10 / 100 - 60;
                    deductions += taxableSalary * 10 / 100 - 60;
                  } else if (taxableSalary > 1650 && taxableSalary < 3200) {
                    incomeTaxs = taxableSalary * 15 / 100 - 142.5;
                    deductions += taxableSalary * 15 / 100 - 142.5;
                  } else if (taxableSalary > 3200 && taxableSalary < 5250) {
                    incomeTaxs = taxableSalary * 20 / 100 - 302.5;
                    deductions += taxableSalary * 20 / 100 - 302.5;
                  } else if (taxableSalary > 5250 && taxableSalary < 7800) {
                    incomeTaxs = taxableSalary * 25 / 100 - 565;
                    deductions += taxableSalary * 25 / 100 - 565;
                  } else if (taxableSalary > 7800 && taxableSalary < 10900) {
                    console.log ('30' + taxableSalary);
                    incomeTaxs = taxableSalary * 30 / 100 - 955;
                    deductions += taxableSalary * 30 / 100 - 955;
                  }
                  if (taxableSalary > 10900) {
                    console.log ('35');
                    incomeTaxs = taxableSalary * 35 / 100 - 1500;
                    deductions += taxableSalary * 35 / 100 - 1500;
                  }
                  break;
                case 'Pension':
                  employeePension += pensionableSalary * 7 / 100;
                  employerPension += pensionableSalary * 11 / 100;
                  deductions += pensionableSalary * 7 / 100;
                  break;

                default:
                  break;
              }
            }
          }
        });
        netSalary = parseInt (grossSalary) - parseInt (deductions);

        const salaryStructure = await prisma.employeePayroll.create ({
          data: {
            payroll: {connect: {id: newPayroll.id}},
            employeeWorkDetail: {connect: {id: emp.employeeWorkDetailId}},
            salary: salary.toString (),
            totalEarning: (parseInt (taxableearnings) +
              parseInt (nonTaxableearnings)).toString (),
            grossSalary: grossSalary.toString (),
            totalDeduction: deductions.toString (),
            incomeTax: incomeTaxs.toString (),
            employeePension: employeePension.toString (),
            employerPension: employerPension.toString (),
            netSalary: netSalary.toString (),
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
