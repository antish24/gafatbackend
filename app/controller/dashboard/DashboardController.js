// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

exports.GetCount = async (req, res) => {
  try {
    const employeeCount = await prisma.employee.count();
    const vacancyCount = await prisma.vacancy.count();
    const projectCount = await prisma.project.count();
    const branchCount = await prisma.branch.count();
    const companyCount = await prisma.company.count();
    const positionCount = await prisma.position.count();
    // const interviewCount = await prisma.interview.count();
    const departmentCount = await prisma.department.count();
    const assetCount = await prisma.inventory.count();
    res.json({
      employeeCount,
      vacancyCount,
      projectCount,
      branchCount,
      departmentCount,
      companyCount,
    //   leaveCount,
      positionCount,
    //   interviewCount,
    //   organizationCount,
      assetCount,
    });
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.BalanceDetail = async (req, res) => {
  const {id} = req.query;
  try {
    const detail = await prisma.leaveBalance.find ({where: {id: id}});
    return res.status (200).json ({detail});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.UpdateBalanceDetail = async (req, res) => {
  const {balance,id} = req.body;
  try {
    await prisma.leaveBalance.update ({
      where: {id: id},
      data: {
        balance
      },
    });
    return res.status (200).json ({message: 'Leave Balance Updated'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};
