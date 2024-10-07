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
  
      const findEmpProject = await Promise.all(
        employees.map(async emp => {
          // Fetch the employeeProject and employee's IDNO
          const foundEmpProject = await prisma.employeeProject.findFirst({
            where: {
              workDetailId: emp,
              projectId: project,
            },
          });
  
          if (foundEmpProject) {
            // Fetch the employee's IDNO if already assigned
            const employee = await prisma.employeeWorkDetail.findUnique({
              where: { id: emp },
              select: { employee:{select:{IDNO:true}}}, // assuming "idno" is the field for employee ID number
            });
            return employee ? employee.employee.IDNO : null;
          }
          return null;
        })
      );
  
      // Filter to get the IDs of employees already assigned
      const alreadyAssigned = findEmpProject.filter(Boolean); // Filters out null values
      if (alreadyAssigned.length > 0) {
        return res.status(409).json({ 
          message: `Employee(s) with IDNO(s) ${alreadyAssigned.join(', ')} are already assigned to this project`
        });
      }
  
  
      // Assign all employees to the project
      await Promise.all(
        employees.map(async emp => {
          return await prisma.employeeProject.create({
            data: {
              workDetail: {
                connect: { id: emp },
              },
              role,
              project: {
                connect: { id: project },
              },
            },
          });
        })
      );
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
