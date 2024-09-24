const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

exports.AssignEmployee = async (req, res) => {
  const {project,role,employees} = req.body;
  try {
    console.log(role,employees,project)
    const findProject = await prisma.project.findUnique ({
        where: {
          id: project,
        },
      });
      if (!findProject) {
        return res.status (401).json ({message: "Project not found"});
      }
  
     employees.forEach (async emp => {
      await prisma.employeeProject.create({data: {
        workDetail: {
          connect: {id: emp},
        },
        role,
        project: {
          connect: {id: project},
        },
      }});
    })
    return res.status (200).json ({message:'Employees Assigned Successfully'});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.ProjectEmployee = async (req, res) => {
    const {project} = req.query;
    try {
      const findProjectEmployees = await prisma.employeeProject.findMany ({
          where: {
            projectId: project,
          },
          include:{workDetail:{include:{employee:true,position:true}}}
        });
        if (!findProjectEmployees) {
          return res.status (401).json ({message: "Project not found"});
        }

        const employees = findProjectEmployees.map (emp => {
          return {
            IDNO: emp.workDetail.employee.IDNO,
            fName: emp.workDetail.employee.fName,
            mName: emp.workDetail.employee.mName,
            lName: emp.workDetail.employee.lName,
            sex: emp.workDetail.employee.sex,
            position: emp.workDetail.position.name,
            status: emp.status,
            assignedAt: emp.createdAt,
            role: emp.role,
            id: emp.id,
          }})

      return res.status (200).json ({employees});
    } catch (error) {
      console.log(error)
      return res.status (500).json ({message: 'Something went wrong'});
    }
  };
