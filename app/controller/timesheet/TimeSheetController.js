// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

exports.TimeSheetForm = async (req, res) => {
  const { day, month, site, type } = req.query;
  try {
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Validation: Ensure the day and month are not in the future
    if ((day > currentDay) || (month > currentMonth)) {
      return res.status(404).json({ message: 'Date Must Be Equal Or Less than Today' });
    }

    // Fetch the projects associated with the site
    const findSiteTimeSheet = await prisma.employeeProject.findMany({
      where: { project: { site: site } },
    });

    // Return if no projects were found for the given site
    if (findSiteTimeSheet.length < 1) {
      return res.status(404).json({ message: 'No Time Sheet found for this site.' });
    }

    // Fetch existing time sheets for the specified day, month, year, and site
    const findTimeSheet = await prisma.timeSheet.findMany({
      where: {
        day: parseInt(day),
        month: parseInt(month), // Correctly using query month
        year: parseInt(currentYear),
        employeeProject: { project: { site: site } },
      },
    });

    // If no time sheets are found, create them for each project under the site
    if (findTimeSheet.length < 1) {
      await Promise.all(findSiteTimeSheet.map(async (data) => {
        // Check if a time sheet already exists for the employeeProject on the specified day
        const existingTimeSheet = await prisma.timeSheet.findFirst({
          where: {
            day: parseInt(day),
            month: parseInt(month),
            year: parseInt(currentYear),
            employeeProjectId: data.id, // Check by employeeProject id
          },
        });

        // Only create a time sheet if one doesn't already exist
        if (!existingTimeSheet) {
          await prisma.timeSheet.create({
            data: {
              employeeProject: { connect: { id: data.id } },
              regularPH: 0,
              regularPOTH: 0,
              specialPH: 0,
              OT32: 0,
              totalHours: 0,
              day: parseInt(day),
              month: parseInt(month), // Use query month
              year: currentYear,
            },
          });
        }
      }));
    }

    // Fetch all the time sheets again after creation
    const list = await prisma.timeSheet.findMany({
      where: { 
        day: parseInt(day), 
        month: parseInt(month), 
        year: parseInt(currentYear),
        employeeProject: { project: { site: site } } 
      },
      include: {
        employeeProject: { 
          include: { 
            workDetail: { 
              include: { employee: true } 
            } 
          } 
        },
      },
    });

    // Map the result to return the desired structure
    const all = list.map(emp => {
      return {
        id: emp.id,
        IDNO: emp.employeeProject.workDetail.employee.IDNO,
        fName: emp.employeeProject.workDetail.employee.fName,
        mName: emp.employeeProject.workDetail.employee.mName,
        lName: emp.employeeProject.workDetail.employee.lName,
        regularPH: emp.regularPH,
        regularPOTH: emp.regularPOTH,
        specialPH: emp.specialPH,
        OT32: emp.OT32,
        totalHours: emp.totalHours,
        day: emp.day,
        month: emp.month,
        year: emp.year,
        status: emp.status,
      };
    });

    // Return the resulting time sheets
    return res.status(200).json({ all });
    
  } catch (error) {
    console.error('Error:', error); // Log the error for debugging
    return res.status(500).json({ message: 'Something went wrong' });
  }
};


exports.TimeSheetFormDetail = async (req, res) => {
  const {id} = req.query;
  console.log(id)
  try {
    const detail = await prisma.timeSheet.findUnique ({
      where: {
        id:id
      },
    });

    return res.status (200).json ({detail});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.TimeSheetFormUpdate = async (req, res) => {
  const {id,regularPH,regularPOTH,OT32,specialPH} = req.body;
  try {
    const detail = await prisma.timeSheet.update ({
      where: {
        id:id
      },
      data:{regularPH:parseInt(regularPH),
        regularPOTH:parseInt(regularPOTH),
        OT32:parseInt(OT32),specialPH:parseInt(specialPH),
        totalHours:parseInt(regularPH)+parseInt(regularPOTH)+parseInt(OT32)+parseInt(specialPH)}
    });

    return res.status (200).json ({detail});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.TimeSheetData = async (req, res) => {
  const {month, site, type} = req.query;
  try {
    const currentMonth = new Date ().getMonth ()+1;
    const currentYear = new Date ().getFullYear ();

    if((month > currentMonth)){
      return res.status(404).json({message: 'Date Must Be Equal Or Less that Today'})
    }

    const findSiteTimeSheet = await prisma.employeeProject.findMany ({
      where: {
        project:{site:site}
      },
    });

    if(findSiteTimeSheet.length <1){
      return res.status(404).json({message: 'No Time Sheet found for this site.'})
    }
    
    const list = await prisma.timeSheet.findMany ({
      where: {month:parseInt(month),year:parseInt(currentYear),employeeProject:{project:{site:site}}},
      include: {
        employeeProject: {include: {workDetail: {include: {employee: true}}}},
      },
    });

    const groupedList = list.reduce((groups, item) => {
      const id = item.employeeProject.workDetail.employee.id;  
      groups[id] = groups[id] || [];
      groups[id].push(item);
      return groups;
    }, {});
    
    const all = Object.values(groupedList).map (emp => {
      const regularPH = emp.reduce((total, item) => {
        if(item.regularPH !== 0) {
          return total + item.regularPH;
        }
        return total;
      }, 0);
      
      // Count days where regularPH is not 0  
      const regularPD = emp.reduce((count, item) => {
        if(item.regularPH !== 0) {
          return count + 1;
        }
        return count;
      }, 0);
  
  
      const regularPOTH = emp.reduce((total, item) => {
        if(item.regularPOTH !== 0) {
          return total + item.regularPOTH;
        }
        return total;
      }, 0);
      
      // Count days where regularPH is not 0  
      const regularPOTD = emp.reduce((count, item) => {
        if(item.regularPOTH !== 0) {
          return count + 1;
        }
        return count;
      }, 0);
  
      const specialPH = emp.reduce((total, item) => {
        if(item.specialPH !== 0) {
          return total + item.specialPH;
        }
        return total;
      }, 0);

      const OT32H = emp.reduce((total, item) => {
        if(item.OT32 !== 0) {
          return total + item.OT32;
        }
        return total;
      }, 0);
      
      // Count days where regularPH is not 0  
      const specialPD = emp.reduce((count, item) => {
        if(item.specialPH !== 0) {
          return count + 1;
        }
        return count;
      }, 0);
  
      const totalDays = emp.reduce((count, item) => {
          return count + 1;
      }, 0);
  
      const totalHours = emp.reduce((total, item) => {
          return total + item.totalHours ;
      }, 0);


      console.log(totalHours,regularPH)
      return {
        id: emp[0].id,
        IDNO: emp[0].employeeProject.workDetail.employee.IDNO,
        fName: emp[0].employeeProject.workDetail.employee.fName,
        mName: emp[0].employeeProject.workDetail.employee.mName,
        lName: emp[0].employeeProject.workDetail.employee.lName,
        regularPD: regularPD,
        regularPH:regularPH,
        regularPOTD: regularPOTD,
        regularPOTH:regularPOTH,
        specialPD:specialPD,
        specialPH:specialPH,
        OT32: OT32H,
        totalDays: totalDays,
        totalHours:totalHours,
        month: emp[0].month,
        year: emp[0].year,
        status: emp[0].status,
      };
    });
    return res.status (200).json ({all});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.TestDelete = async (req, res) => {
  try {
    // const company = await prisma.company.create ({
    //   data: {
    //     name: 'Twoh z',
    //     phone: '099667788',
    //     email: 'twoz@gmail.com',
    //     VAT: '6782778',
    //     TIN: '0666788',
    //     license: 'TZ1178',
    //     profile: 'img',
    //   },
    // });
    // console.log(company.id)

//     const project = await prisma.project.create ({
//       data: {
//         company: {connect: {id:"84f418b5-ac41-4f0b-966c-8db7c1210a93"}},
//         site: 'Arada Adwa Hall',
//         noSecurity: 1,
//         startDate: '2024-09-18T00:00:00Z',
//         endDate: '2024-09-18T00:00:00Z',
//         price: 100,
//         attachments: 'file',
//       },
//     });
// console.log(project.id)
    const projectEmp = await prisma.employeeProject.create ({
      data: {
        project: {connect: {id: "25ed4d0a-f4be-47ba-937f-aa29a74e703e"}},
        workDetail: {connect: {id: '5665688a-e079-45ab-a708-0b39c9e4983d'}},
        role: 'guard',
      },
    });

    const list = projectEmp;
    console.log (list);
    return res.status (200).json ({list});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};
