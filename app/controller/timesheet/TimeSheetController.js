// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

exports.TimeSheetForm = async (req, res) => {
  const {day, month, site, type} = req.query;
  try {
    const currentDay = new Date ().getDate ();
    const currentMonth = new Date ().getMonth ()+1;
    const currentYear = new Date ().getFullYear ();

    if((day > currentDay) || (month > currentMonth)){
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
    
    
    const findTimeSheet = await prisma.timeSheet.findMany ({
      where: {
        day: parseInt (currentDay),
        month: parseInt (currentMonth),
        year: parseInt (currentYear),
        employeeProject:{project:{site:site}}
      },
    });

    if (findTimeSheet.length < 1) {
      findSiteTimeSheet.forEach(async(data)=>{
      await prisma.timeSheet.create ({
        data: {
          employeeProject: {connect: {id: data.id}},
          regularPH: 0,
          regularPOTH: 0,
          specialPH: 0,
          OT32: 0,
          totalHours: 0,
          day: currentDay,
          month: currentMonth,
          year: currentYear,
        },
      });
    })
    }
    const list = await prisma.timeSheet.findMany ({
      where: {day: parseInt (day),month:parseInt(month),year:parseInt(currentYear)},
      include: {
        employeeProject: {include: {workDetail: {include: {employee: true}}}},
      },
    });

    const all = list.map (emp => {
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
    return res.status (200).json ({all});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
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

    const regularPH = list.reduce((total, item) => {
      if(item.regularPH !== 0) {
        return total + item.regularPH;
      }
      return total;
    }, 0);
    
    // Count days where regularPH is not 0  
    const regularPD = list.reduce((count, item) => {
      if(item.regularPH !== 0) {
        return count + 1;
      }
      return count;
    }, 0);


    const regularPOTH = list.reduce((total, item) => {
      if(item.regularPOTH !== 0) {
        return total + item.regularPOTH;
      }
      return total;
    }, 0);
    
    // Count days where regularPH is not 0  
    const regularPOTD = list.reduce((count, item) => {
      if(item.regularPOTH !== 0) {
        return count + 1;
      }
      return count;
    }, 0);

    const specialPH = list.reduce((total, item) => {
      if(item.specialPH !== 0) {
        return total + item.specialPH;
      }
      return total;
    }, 0);
    
    // Count days where regularPH is not 0  
    const specialPD = list.reduce((count, item) => {
      if(item.specialPH !== 0) {
        return count + 1;
      }
      return count;
    }, 0);

    const totalDays = list.reduce((count, item) => {
        return count + 1;
    }, 0);

    const totalHours=specialPD+regularPD+regularPOTD

    
    const all = list.map (emp => {
      return {
        id: emp.id,
        IDNO: emp.employeeProject.workDetail.employee.IDNO,
        fName: emp.employeeProject.workDetail.employee.fName,
        mName: emp.employeeProject.workDetail.employee.mName,
        lName: emp.employeeProject.workDetail.employee.lName,
        regularPD: regularPD,
        regularPH:regularPH,
        regularPOTD: regularPOTD,
        regularPOTH:regularPOTH,
        specialPD:specialPD,
        specialPH:specialPH,
        OT32: emp.OT32,
        totalDays: totalDays,
        totalHours:totalHours + parseInt(emp.OT32),
        month: emp.month,
        year: emp.year,
        status: emp.status,
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
//         company: {connect: {id:"f8a1739f-2046-46d6-ab1a-327a1b524037"}},
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
        project: {connect: {id: "e0d80849-7110-4640-a489-f664a1951a8f"}},
        workDetail: {connect: {id: '34e08e39-bcf1-4678-aa29-0a4671e535a5'}},
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
