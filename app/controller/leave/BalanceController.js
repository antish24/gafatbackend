// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

exports.AllBalance = async (req, res) => {
  try {
    const list = await prisma.leaveBalance.findMany ({include:{employee:true},orderBy:{createdAt:'desc'}});

    const all = list.map (emp => {
      return {
        empId: emp.employee.id,
        IDNO: emp.employee.IDNO,
        fName: emp.employee.fName,
        mName: emp.employee.mName,
        lName: emp.employee.lName,
        sex: emp.employee.sex,
        id: emp.id,
        balance: emp.balance,
        used: emp.used,
        createdAt: emp.createdAt,
      };
    });
    return res.status (200).json ({all});
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