const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

exports.AllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany ();
    return res.status (200).json ({projects});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};
