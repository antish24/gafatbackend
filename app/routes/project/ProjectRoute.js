// const express=require('express')
// const router=express.Router()
// const ProjectController=require('../../controller/project/ProjectController') 

// router.get('/all',ProjectController.AllProjects)

// module.exports=router


const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configure multer to save the uploaded file
const upload = multer({
  dest: 'uploads/', // Directory to save uploaded files
  limits: { fileSize: 5 * 1024 * 1024 }, // Adjust file size limit if needed
});

// POST route to add a project
router.post('/add', upload.single('attachments'), async (req, res) => {
  try {
    const { name, company, location, noSecurity } = req.body;
    // Handle attachment
    const attachments = req.file ? req.file.path : 'default/path/to/attachment';

    // Check if all required fields are present
    if (!name || !company || !location || !noSecurity) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        company,
        location,
        noSecurity,
        attachments, // Use the path of the uploaded file or default path
      },
    });

    res.json(newProject);
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// GET route to fetch all projects
router.get('/all', async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET route to fetch a specific project by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }, // Ensure the ID is converted to an integer
    });

    const projectEmp = await prisma.projectEmployee.findMany({
      where: { projectId: parseInt(id) },
      include: { employee: true }, // Include employee details
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project, projectEmp });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// PUT route to edit a project
router.put('/edit/:id', upload.single('attachments'), async (req, res) => {
  const { id } = req.params;
  const { name, company, location, noSecurity } = req.body;
  try {
    // Handle attachment
    const attachments = req.file ? req.file.path : null;

    // Find the project to update
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        name: name || project.name,
        company: company || project.company,
        location: location || project.location,
        noSecurity: noSecurity || project.noSecurity,
        attachments: attachments || project.attachments,
      },
    });

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// GET route to fetch all employees
router.get('/employees/all', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany(); // Fetch all employees from the employee table
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// POST route to assign employees to a project
router.post('/:id/assign-employees', async (req, res) => {
  const { id } = req.params; // Project ID
  const { employeeIds } = req.body; // Array of selected employee IDs

  try {
    // First, check if the project exists
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create or connect the employees to the project via the ProjectEmployee table
    const assignments = employeeIds.map((employeeId) => {
      return prisma.projectEmployee.upsert({
        where: {
          projectId_employeeId: { projectId: parseInt(id), employeeId: parseInt(employeeId) },
        },
        create: {
          projectId: parseInt(id),
          employeeId: parseInt(employeeId),
        },
        update: {}, // Leave empty as we don't want to update the existing assignment
      });
    });

    // Execute all assignments
    await prisma.$transaction(assignments);

    // Return updated project details including assigned employees
    // Return updated project details including assigned employees
const updatedProject = await prisma.projectEmployee.findMany({
  where: { projectId: parseInt(id) }, // Use projectId instead of id
  include: {
    employee: true, // Include employee details in the response
  },
});


    res.json(updatedProject);
  } catch (error) {
    console.error('Error assigning employees:', error);
    res.status(500).json({ error: 'Failed to assign employees' });
  }
});

// POST route to update employee status (Active/Terminated)
router.post('/:id/update-employee-status', async (req, res) => {
  const { id } = req.params; // Project ID
  const { employeeId, status } = req.body; // Employee ID and new status

  try {
    // Validate the input status (ensure it's either 'Active' or 'Terminated')
    if (!['Active', 'Terminated'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if the employee is assigned to the project
    const projectEmployee = await prisma.projectEmployee.findUnique({
      where: {
        projectId_employeeId: { projectId: parseInt(id), employeeId: parseInt(employeeId) },
      },
    });

    if (!projectEmployee) {
      return res.status(404).json({ error: 'Employee not assigned to this project' });
    }

    // Update the employee status for the project
    const updatedProjectEmployee = await prisma.projectEmployee.update({
      where: {
        projectId_employeeId: { projectId: parseInt(id), employeeId: parseInt(employeeId) },
      },
      data: {
        status, // Update the status field
      },
    });

    res.json({ message: 'Employee status updated successfully', updatedProjectEmployee });
  } catch (error) {
    console.error('Error updating employee status:', error);
    res.status(500).json({ error: 'Failed to update employee status' });
  }
});



// POST route to add team members to a project
router.post('/:id/add-team', async (req, res) => {
  const { id } = req.params;
  const { team } = req.body; // Expecting an array of team members

  try {
    // Find the project by ID
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Clear existing team members before adding new ones
    await prisma.projectEmployee.deleteMany({
      where: { projectId: parseInt(id) },
    });

    // Prepare new team member assignments
    const assignments = team.map((member) => {
      return prisma.projectEmployee.create({
        data: {
          projectId: parseInt(id),
          employeeId: member.employeeId,
          role: member.role,
        },
      });
    });

    // Use Prisma's transaction to ensure atomicity
    await prisma.$transaction(assignments);

    // Fetch updated project with assigned employees
    const updatedProject = await prisma.projectEmployee.findMany({
      where: { projectId: parseInt(id) },
      include: {
        project: {include:{employees:true}
          // include: {
          //   employee: {
          //     select: {
          //       id: true,
          //       fName: true,
          //       lName: true,
          //     },
          //   },
          //   role: true,
          // },
        },
      },
    });

    // Respond with the updated project data
    res.json({
      project: updatedProject[0],
      message: 'Team members added successfully',
    });
  } catch (error) {
    console.error('Error adding team members:', error);
    res.status(500).json({ error: 'Failed to add team members' });
  }
});

// Fetch team members for a specific project
router.get('/:id/team', async (req, res) => {
  const projectId = parseInt(req.params.id);

  try {
    const team = await prisma.projectEmployee.findMany({
      where: { projectId },
      include: {
        employee: true, // Include employee details
      },
    });

    if (!team) {
      return res.status(404).json({ error: 'No team members found for this project' });
    }

    res.json({ team });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Route to remove a team member from a project
// Route to remove a team member from a project
router.delete('/:id/remove-team-member', async (req, res) => {
  const { id } = req.params; // Get the project ID from the URL
  const { employeeId } = req.body; // Get the employeeId from the request body

  try {
    // Check if the employee is part of the project team
    const projectEmployee = await prisma.projectEmployee.findUnique({
      where: {
        projectId_employeeId: {
          projectId: parseInt(id),
          employeeId: parseInt(employeeId),
        },
      },
    });

    if (!projectEmployee) {
      return res.status(404).json({ error: 'Team member not found in the project' });
    }

    // Remove the employee from the project team
    await prisma.projectEmployee.delete({
      where: {
        projectId_employeeId: {
          projectId: parseInt(id),
          employeeId: parseInt(employeeId),
        },
      },
    });

    res.status(200).json({ message: 'Team member removed successfully' });
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({ error: 'Failed to remove team member' });
  }
});




module.exports = router;
