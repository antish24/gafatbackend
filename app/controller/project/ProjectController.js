const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Controller to handle creating a new project
const createProject = async (req, res) => {
  try {
    const { name, company, location, noSecurity } = req.body;

    // Handle file uploads
    const attachments = req.file ? req.file.path : null;

    const newProject = await prisma.project.create({
      data: {
        name,
        company,
        location,
        noSecurity,
        attachments,
      },
    });

    res.json(newProject);
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
};

module.exports = {
  createProject,
};
