const {PrismaClient} = require ('@prisma/client');
const bcrypt = require ('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = require("../config/index");

const prisma = new PrismaClient ();
const secretKey = config.JWTSECRET;
const expiresIn = config.EXPIREDIN;

exports.Logout = async (req, res) => {
  try {
    const users = await prisma.user.findMany ();
    return res.status (200).json ({users});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.Login = async (req, res) => {
  const {email,password}=req.body;
  try {
    const user = await prisma.user.findUnique({where:{email,password}});
    if (!user) {return res.status(404).json ({message: 'Invaild Creditial'});}
    

    const token = jwt.sign({ customerId: user.id }, secretKey, {
      expiresIn: expiresIn,
    });

    await prisma.user.update({where:{email},data:{token:token}})

    return res.status (200).json ({message:"Wellcome User",token});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.Forget = async (req, res) => {
  try {
    const users = await prisma.user.findMany ();
    return res.status (200).json ({users});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};
