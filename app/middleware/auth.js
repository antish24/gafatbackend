const jwt = require('jsonwebtoken');
const config = require('../config/index');
const secretKey = config.JWT_SECRET;
const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

require('dotenv').config()

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // return res.status(401).json({ error: 'UnAuthorized' });
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const [bearer, token] = authHeader.split(' ');
  
    if (bearer !== 'Bearer' || !token) {
      // return res.status(401).json({ error: 'UnAuthorized' });
      return res.status(401).json({ error: 'Invalid token format' });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
      const customerId = decoded.customerId;
  
      const customer = await prisma.user.findUnique({where:{id:customerId}})
  
      if (!customer || customer.token !== token) {
        return res.status(401).json({ error: 'UnAuthorized' });
      }
      req.customer = customer;
      next();
    } catch (err) {
      return res.status(403).json({ error: 'Session expired' });
    }
};

module.exports = authMiddleware;