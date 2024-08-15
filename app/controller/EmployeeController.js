const {PrismaClient} = require ('@prisma/client');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
require ('dotenv').config ();
const config = require ('../config/index');

const prisma = new PrismaClient ();
const secretKey = config.JWTSECRET;
const expiresIn = config.EXPIREDIN;

exports.AllEmployee = async (req, res) => {
  try {
    const rawEmployees = await prisma.reportTracker.findMany ({
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            idNumber: true,
            mobile: true,
            gender: true,
            dateOfBirth: true,
          },
        },
      },
    });

    const employees = rawEmployees.map (d => {
      return {
        id: d.id,
        status: d.status,
        firstName: d.employee.firstName,
        lastName: d.employee.lastName,
        idNumber: d.employee.idNumber,
        mobile: d.employee.mobile,
        gender: d.employee.gender,
        dateOfBirth: d.employee.dateOfBirth,
        reports: d.reports,
        createdAt: d.createdAt,
        guilty: d.guilty,
      };
    });

    console.log (rawEmployees[0]);
    return res.status (200).json ({employees});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.SearchEmployee = async (req, res) => {
  const {IdNo} = req.query;
  try {
    const employee = await prisma.employee.findUnique ({
      where: {idNumber: IdNo},
    });
    if (!employee) {
      return res.status (404).json ({message: 'employee not Found'});
    }
    const employeeStatusRaw = await prisma.reportTracker.findUnique ({
      where: {employeeId: employee.id},
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            idNumber: true,
            mobile: true,
            gender: true,
            dateOfBirth: true,
          },
        },
      },
    });

    const employeeStatus={
      status: employeeStatusRaw.status,
        firstName: employeeStatusRaw.employee.firstName,
        lastName: employeeStatusRaw.employee.lastName,
        idNumber: employeeStatusRaw.employee.idNumber,
        mobile: employeeStatusRaw.employee.mobile,
        gender: employeeStatusRaw.employee.gender,
        dateOfBirth: employeeStatusRaw.employee.dateOfBirth,
        reports: employeeStatusRaw.reports,
        createdAt: employeeStatusRaw.createdAt,
        guilty: employeeStatusRaw.guilty,
    }
    console.log (employee);
    console.log (employeeStatus);
    return res
      .status (200)
      .json ({message: 'Employee Found', employeeStatus: employeeStatus});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};
