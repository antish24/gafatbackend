// app/controller/planController.js
// const { prisma } = require('@prisma/client');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


// Get all plans
const getAllPlans = async (req, res) => {
  try {
    const plans = await prisma.projectPlan.findMany();
    res.status(200).json(plans);
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
};

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.status(200).json(companies);
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};
// const getAllCompanies = async (req, res) => {
//     console.log('Fetching companies...'); // Debugging line
//     try {
//       const companies = await prisma.company.findMany();
//       console.log('Companies fetched:', companies); // Debugging line
//       res.status(200).json(companies);
//     } catch (error) {
//       console.error('Failed to fetch companies:', error);
//       res.status(500).json({ error: 'Failed to fetch companies' });
//     }
//   };
  

// Create a new plan
const createPlan = async (req, res) => {
    const { noSecurity, price, companyId,site } = req.body;
  
    try {
      if (!noSecurity || !price || !companyId ||!site) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const newPlan = await prisma.projectPlan.create({
        data: {
          noSecurity:parseInt(noSecurity),
          site,
          price: parseFloat(price),
          attachments:'filename', // Now will be a string or null
          companyId:companyId,
        },
      });
      res.status(201).json(newPlan);
    } catch (error) {
      console.error('Failed to add plan:', error);
      res.status(500).json({ error: 'Failed to add plan' });
    }
  };
  
  

// Update an existing plan by ID
// Update an existing plan by ID
const updatePlan = async (req, res) => {
    const { id } = req.params;
    const { securityNo, pricePerSecurity, companyId } = req.body; // Include companyId
  
    try {
      const updatedPlan = await prisma.projectPlan.update({
        where: { id: parseInt(id) },
        data: { 
          securityNo, 
          pricePerSecurity: parseFloat(pricePerSecurity),
          companyId: parseInt(companyId), // Update the companyId as well
        },
      });
      res.status(200).json(updatedPlan);
    } catch (error) {
      console.error('Failed to update plan:', error);
      res.status(500).json({ error: 'Failed to update plan' });
    }
  };
  

// Delete a plan by ID
const deletePlan = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.projectPlan.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete plan:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
};

// Update the status of a plan
const updatePlanStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedPlan = await prisma.plan.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error('Failed to update plan status:', error);
    res.status(500).json({ error: 'Failed to update plan status' });
  }
};

// Export the functions
module.exports = {
  getAllPlans,
  getAllCompanies,  // Export the new function
  createPlan,
  updatePlan,
  deletePlan,
  updatePlanStatus,
};
