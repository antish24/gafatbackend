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
  const { from, to, project, basedOn } = req.body;
  try {
    const employeeProject = await prisma.employeeProject.findMany({
      where: { projectId: project },
      include: { workDetail: { include: { employee: true } } },
    });

    const empSalaryStructure = [];

    for (const emp of employeeProject) {
      const salaryStructure = await prisma.employeeSalaryStructure.findMany({
        where: {
          employeeWorkDetailId: emp.workDetailId,
        },
        include: {
          employeeWorkDetail: true,
          salaryStructureForm: {
            include: {
              salaryStructure: { include: { salaryComponent: true } },
            },
          },
        },
      });

      empSalaryStructure.push(salaryStructure);
    }

    const newPayroll = await prisma.payroll.create({
      data: {
        generatedBy: 'ish',
        basedOn: basedOn,
        project: { connect: { id: project } },
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

      // First step: Calculate earnings
      list.forEach(async emp => {
        startDate = emp.employeeWorkDetail.startDate;
        employeeTotalDays = Math.floor(
          (Date.now() - startDate.getTime()) / 86400000
        );
        salary = parseInt(emp.employeeWorkDetail.salary); // Base salary
        grossSalary = salary; // Start with base salary

        // Reset earnings per employee
        taxableearnings = 0;
        nonTaxableearnings = 0;
        pensionearnings = 0;

        // Calculate earnings based on components
        emp.salaryStructureForm.salaryStructure.forEach(d => {
          if (d.salaryComponent.type === 'Earning') {
            if (employeeTotalDays >= d.salaryComponent.applicableAfter) {
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
              if (d.salaryComponent.pension === 'Yes') {
                pensionearnings += d.amount;
              }
            }
          }
        });

        // Finalize taxable salary and pensionable salary
        taxableSalary = taxableearnings + salary; // Base salary + taxable earnings
        pensionableSalary = pensionearnings + salary; // Base salary + pensionable earnings
        grossSalary = taxableearnings + nonTaxableearnings + salary; // Full gross salary calculation

        // Log for debugging
        console.log("Taxable Salary after earnings calculation: ", taxableSalary);
        console.log("Gross Salary after earnings calculation: ", grossSalary);

        // Second step: Calculate deductions
        emp.salaryStructureForm.salaryStructure.forEach(d => {
          if (d.salaryComponent.type === 'Deduction') {
            if (employeeTotalDays >= d.salaryComponent.applicableAfter) {
              switch (d.salaryComponent.conditionType) {
                case 'Deduct':
                  deductions += d.amount;
                  break;
                case 'IncomeTax':
                  // Apply income tax on the taxableSalary
                  if (taxableSalary > 601 && taxableSalary < 1650) {
                    incomeTaxs = taxableSalary * 10 / 100 - 60;
                    deductions += incomeTaxs;
                  } else if (taxableSalary > 1650 && taxableSalary < 3200) {
                    incomeTaxs = taxableSalary * 15 / 100 - 142.5;
                    deductions += incomeTaxs;
                  } else if (taxableSalary > 3200 && taxableSalary < 5250) {
                    incomeTaxs = taxableSalary * 20 / 100 - 302.5;
                    deductions += incomeTaxs;
                  } else if (taxableSalary > 5250 && taxableSalary < 7800) {
                    incomeTaxs = taxableSalary * 25 / 100 - 565;
                    deductions += incomeTaxs;
                  } else if (taxableSalary > 7800 && taxableSalary < 10900) {
                    incomeTaxs = taxableSalary * 30 / 100 - 955;
                    deductions += incomeTaxs;
                  } else if (taxableSalary > 10900) {
                    incomeTaxs = taxableSalary * 35 / 100 - 1500;
                    deductions += incomeTaxs;
                  }
                  break;
                case 'Pension':
                  employeePension += pensionableSalary * 7 / 100;
                  employerPension += pensionableSalary * 11 / 100;
                  deductions += employeePension;
                  break;
                default:
                  break;
              }
            }
          }
        });

        // Log deductions for debugging
        console.log("Deductions calculated: ", deductions);

        // Final net salary calculation
        netSalary = parseInt(grossSalary) - parseInt(deductions);

        // Save payroll data for the employee
        const salaryStructure = await prisma.employeePayroll.create({
          data: {
            payroll: { connect: { id: newPayroll.id } },
            employeeWorkDetail: { connect: { id: emp.employeeWorkDetailId } },
            salary: salary.toString(),
            totalEarning: (
              parseInt(taxableearnings) + parseInt(nonTaxableearnings)
            ).toString(),
            grossSalary: grossSalary.toString(),
            totalDeduction: deductions.toString(),
            incomeTax: incomeTaxs.toString(),
            employeePension: employeePension.toString(),
            employerPension: employerPension.toString(),
            netSalary: netSalary.toString(),
          },
        });

        employeePayroll.push(salaryStructure);
      });
    }

    return res
      .status(200)
      .json({ message: 'Payroll Created', all: employeePayroll });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};


