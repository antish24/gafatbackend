// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

exports.AllBalance = async (req, res) => {
  const {year} = req.query;

  try {
    const fullYear = new Date (year);
    const startOfYear = new Date (
      `${fullYear.getFullYear ()}-01-01T00:00:00.000Z`
    );
    const endOfYear = new Date (
      `${fullYear.getFullYear ()}-12-31T23:59:59.999Z`
    );

    const list = await prisma.leaveBalance.findMany ({
      where: {
        year: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      include: {
        employee: true,
      },
      orderBy: {createdAt: 'desc'},
    });

    // Map the results into the desired structure
    const all = list.map (emp => ({
      empId: emp.employee.id,
      IDNO: emp.employee.IDNO,
      fName: emp.employee.fName,
      mName: emp.employee.mName,
      lName: emp.employee.lName,
      sex: emp.employee.sex,
      id: emp.id,
      balance: emp.balance,
      used: emp.used,
      year: emp.year,
      status: emp.status,
      createdAt: emp.createdAt,
    }));

    return res.status (200).json ({all});
  } catch (error) {
    console.error (error);
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
  const {balance, id} = req.body;
  try {
    await prisma.leaveBalance.update ({
      where: {id: id},
      data: {
        balance,
      },
    });
    return res.status (200).json ({message: 'Leave Balance Updated'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};
