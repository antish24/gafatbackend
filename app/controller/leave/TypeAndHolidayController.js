// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const bcrypt = require ('bcrypt');
const prisma = new PrismaClient ();

exports.AllTypes = async (req, res) => {
  try {
    const leaveTypes = await prisma.leaveType.findMany ();
    return res.status (200).json ({leaveTypes});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.TypeDetail = async (req, res) => {
  const {id} = req.query;
  try {
    const detail = await prisma.leaveType.find ({where: {id: id}});
    return res.status (200).json ({detail});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.UpdateTypeDetail = async (req, res) => {
  const {name, maxLeaveDate, applicableAfter, repeat, withPay,id} = req.body;
  try {
    await prisma.leaveType.update ({
      where: {id: id},
      data: {name, maxLeaveDate, applicableAfter, repeat, withPay},
    });
    return res.status (200).json ({message: 'Leave Type Updated'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewType = async (req, res) => {
  const {name, maxLeaveDate, applicableAfter, repeat, withPay} = req.body;
  try {
    await prisma.leaveType.create ({
      data: {
        name, maxLeaveDate:parseInt(maxLeaveDate), applicableAfter:parseInt(applicableAfter), repeat:parseInt(repeat), withPay
      },
    });
    return res.status (200).json ({message: 'New Type Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

//allocation
exports.NewAllocation = async (req, res) => {
  const {count, startMonth,endMonth} = req.body;
  console.log(startMonth)
  try {
    await prisma.leaveAllocation.create ({
      data: {
        startMonth:startMonth,endMonth:endMonth?endMonth:startMonth, count:parseInt(count),
      },
    });
    return res.status (200).json ({message: 'New Allocation Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

exports.AllAllocations = async (req, res) => {
  try {
    const all = await prisma.leaveAllocation.findMany ();
    return res.status (200).json ({all});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};
// holiday controller

exports.AllHoliday = async (req, res) => {
  try {
    const holidays = await prisma.holiday.findMany ();
    return res.status (200).json ({holidays});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.HolidayDetail = async (req, res) => {
  const {id} = req.query;
  try {
    const detail = await prisma.holiday.find ({where: {id: id}});
    return res.status (200).json ({detail});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.UpdateHolidayDetail = async (req, res) => {
  const {name, startDate, endDate} = req.body;
  try {

    const TotalDays=(Math.ceil((new Date(endDate) - new Date(startDate))/ (1000 * 60 * 60 * 24))+1)

    if(TotalDays < 1){
      return res.status (401).json ({message: "Start Date Must be Less than End Date"});
    }

    await prisma.holiday.update ({
      where: {id: id},
      data: {
        name, startDate, endDate, totalDay:parseInt(TotalDays)
      },
    });
    return res.status (200).json ({message: 'Leave Type Updated'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewHoliday = async (req, res) => {
  const {name, startDate, endDate} = req.body;
  try {
    const TotalDays=(Math.ceil((new Date(endDate) - new Date(startDate))/ (1000 * 60 * 60 * 24))+1)

    if(TotalDays < 1){
      return res.status (401).json ({message: "Start Date Must be Less than End Date"});
    }

    await prisma.holiday.create ({
      data: {
        name, startDate, endDate, totalDay:parseInt(TotalDays)
      },
    });
    return res.status (200).json ({message: 'New Holiday Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};
