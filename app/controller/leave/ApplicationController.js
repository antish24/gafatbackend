// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

exports.ApplicationApprove = async (req, res) => {
  const {id}=req.query
  try {
    const leaveApplication = await prisma.leaveApplication.update({where:{id:id},data:{status:'Approved'}});
    await prisma.leaveBalance.update({where:{employeeId:leaveApplication.employeeId},data:{used:leaveApplication.totalDay,balance:{decrement:leaveApplication.totalDay}}});

    return res.status (200).json ({message:"Leave Approved"});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.ApplicationRestore = async (req, res) => {
  const {id}=req.query
  try {
    const leaveApplication = await prisma.leaveApplication.update({where:{id:id},data:{status:'Pending'}});
    await prisma.leaveBalance.update({where:{employeeId:leaveApplication.employeeId},data:{used:leaveApplication.totalDay,balance:{increment:leaveApplication.totalDay}}});

    return res.status (200).json ({message:"Leave Restored"});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.ApplicationFail = async (req, res) => {
  const {id}=req.query
  try {
    await prisma.leaveApplication.update({where:{id:id},data:{status:'Failed'}});
    return res.status (200).json ({message:"Leave Status Changed"});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.AllApplication = async (req, res) => {
  try {
    const list = await prisma.leaveApplication.findMany ({include:{employee:true,leaveType:true},orderBy:{createdAt:'desc'}});

    const all = list.map (emp => {
      return {
        empId: emp.employee.id,
        IDNO: emp.employee.IDNO,
        fName: emp.employee.fName,
        mName: emp.employee.mName,
        lName: emp.employee.lName,
        sex: emp.employee.sex,
        leaveType: emp.leaveType.name,
        id: emp.id,
        status: emp.status,
        startDate: emp.startDate,
        endDate: emp.endDate,
        totalDay: emp.totalDay,
        reason: emp.reason,
        createdAt: emp.createdAt,
      };
    });
    return res.status (200).json ({all});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.ApplicationDetail = async (req, res) => {
  const {id} = req.query;
  try {
    const detail = await prisma.leaveApplication.find ({where: {id: id}});
    return res.status (200).json ({detail});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.UpdateApplicationDetail = async (req, res) => {
  const {startDate,endDate,reason,leaveType,id} = req.body;
  try {
    const TotalDays=(Math.ceil((new Date(endDate) - new Date(startDate))/ (1000 * 60 * 60 * 24))+1)

    if(TotalDays < 1){
      return res.status (401).json ({message: "Start Date Must be Less than End Date"});
    }

    await prisma.leaveApplication.update ({
      where: {id: id},
      data: {
        startDate,endDate,totalDay:parseInt(TotalDays),reason,leaveType:{connect:{id:leaveType}}
      },
    });
    return res.status (200).json ({message: 'Leave Type Updated'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewApplication = async (req, res) => {
  const {employee, startDate,endDate,reason,leaveType} = req.body;
  try {
    const findApplication=await prisma.leaveApplication.findMany({where:{employeeId:employee,status:"Pending"}})
    const findLeaveBalance=await prisma.leaveBalance.findMany({where:{employeeId:employee}})

    const TotalDays=(Math.ceil((new Date(endDate) - new Date(startDate))/ (1000 * 60 * 60 * 24))+1)

    if(TotalDays < 1){
      return res.status (401).json ({message: "Start Date Must be Less than End Date"});
    }

    if(findLeaveBalance[0].balance < TotalDays){
      return res.status (401).json ({message: "employee don't have enough balance to request"});
    }

    if(findApplication.length>0){
      return res.status (401).json ({message: 'Employee Already Have Pending Request'});
    }
    await prisma.leaveApplication.create ({
      data: {
        status:'Pending',employee:{connect:{id:employee}}, startDate,endDate,totalDay:parseInt(TotalDays),reason,leaveType:{connect:{id:leaveType}}
      },
    });
    return res.status (200).json ({message: 'Leave Application Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};
