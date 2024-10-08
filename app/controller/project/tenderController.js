// controllers/tenderController.js
//const prisma = require('prismaClient');
// const { prisma } = require('@prisma/client');
// const prisma = new PrismaClient();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Get all tenders
const getAllTenders = async (req, res) => {
  try {
    const tenders = await prisma.tender.findMany();
    res.status(200).json(tenders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tenders', error });
  }
};

// Create a new tender
// Create a new tender
const createTender = async (req, res) => {
  const { title, description, deadline, budget, attachments, companyName, startingDate } = req.body;

  if (!title || !description || !deadline || !budget || !companyName || !startingDate) {
    return res.status(400).json({ message: 'Title, description, deadline, budget, company name, and starting date are required' });
  }

  try {
    const newTender = await prisma.tender.create({
      data: { 
        title,
        description,
        deadline: new Date(deadline),
        budget: parseFloat(budget),
        status:'Pending',
        attachments: attachments,
        companyName, // Add company name
        startingDate: new Date(startingDate), // Add starting date
      },
    });
    res.status(201).json({ message: 'Tender created successfully', newTender });
  } catch (error) {
    console.error('Error creating tender:', error);
    res.status(500).json({ message: 'Error creating tender', error: error.message });
  }
};


// Update a tender
const updateTender = async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline } = req.body;

  try {
    const updatedTender = await prisma.tender.update({
      where: { id: Number(id) },
      data: { title, description, deadline: new Date(deadline) },
    });
    res.status(200).json({ message: 'Tender updated successfully', updatedTender });
  } catch (error) {
    res.status(500).json({ message: 'Error updating tender', error });
  }
};

// Delete a tender
const deleteTender = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTender = await prisma.tender.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: 'Tender deleted successfully', deletedTender });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tender', error });
  }
};

const updateTenderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
  
    try {
      const updatedTender = await prisma.tender.update({
        where: { id: Number(id) },
        data: { status },
      });
      res.status(200).json({ message: 'Status updated successfully', updatedTender });
    } catch (error) {
      console.error('Error updating tender status:', error);
      res.status(500).json({ message: 'Error updating tender status', error: error.message });
    }
  };
  

module.exports = {
  getAllTenders,
  createTender,
  updateTender,
  deleteTender,
  updateTenderStatus, // Export the new function
};
