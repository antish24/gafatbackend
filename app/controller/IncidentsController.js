const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

exports.NewIncident = async (req, res) => {
  const {
    //employee data
    idNumber,
    firstName,
    gender,
    lastName,
    dateOfBirth,
    mobile,

    //company data
    name,
    type,
    email,
    phone,
    tinNumber,
    licenseNumber,

    //employee history
    jobTitle,
    startDate,
    endDate,
    status,

    //incident data
    reportername,
    reporterphone,
    incidents,
    incidentDate,
    incidentMagnitude,
    note,
    Attachments,
  } = req.body;

  try {
    let EmployeeData = [];
    let CompanyData = [];
    let EmployeeHistoryData = [];

    EmployeeData = await prisma.employee.findUnique ({
      where: {idNumber: idNumber},
    });

    CompanyData = await prisma.company.findUnique ({
      where: {tinNumber, licenseNumber},
    });

    if (!EmployeeData) {
      EmployeeData = await prisma.employee.create ({
        data: {idNumber, gender, firstName, lastName, mobile, dateOfBirth},
      });
    }

    if (!CompanyData) {
      CompanyData = await prisma.company.create ({
        data: {licenseNumber, tinNumber, name, type, email, phone},
      });
    }

    const findIncidentReport = await prisma.incidentReports.findMany ({
      where: {
        incidents,
        employeeId: EmployeeData.id,
        companyId: CompanyData.id,
      },
    });
    if (findIncidentReport.length > 0)
      return res.status (401).json ({message: 'Incident Already Reported'});
    const newIncident = await prisma.incidentReports.create ({
      data: {
        reportername,
        reporterphone,
        // companyId: CompanyData.id,
        // employeeId: EmployeeData.id,
        company: {
          connect: {id: CompanyData.id},
        },
        employee: {
          connect: {id: EmployeeData.id},
        },
        incidents,
        incidentDate,
        incidentMagnitude,
        note,
        Attachments,
      },
    });

    EmployeeHistoryData = await prisma.employeeHistory.create ({
      data: {
        // companyId: CompanyData.id,
        // employeeId: EmployeeData.id,
        // incidentId:newIncident.id,
        jobTitle,
        startDate,
        endDate,
        status,
        company: {
          connect: {id: CompanyData.id},
        },
        incident: {
          connect: {id: newIncident.id},
        },
        employee: {
          connect: {id: EmployeeData.id},
        },
      },
    });

    const findReportTracker = await prisma.reportTracker.findUnique ({
      where: {
        employeeId: EmployeeData.id,
      },
    });

    if (findReportTracker) {
      await prisma.reportTracker.update ({
        where: {
          id: findReportTracker.id,
        },
        data: {
          reports: {increment: 1},
        },
      });
    } else {
      await prisma.reportTracker.create ({
        data: {
          employee: {connect: {id: newIncident.employeeId}},
          status: 'Innocent',
          guilty: 0,
          reports: 1,
        },
      });
    }

    return res.status (200).json ({message: 'Incident Reported Successfully'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.GetIncidents = async (req, res) => {
  try {
    const incidents = await prisma.incidentReports.findMany ({
      include: {
        employee: {select: {firstName: true, idNumber: true, lastName: true}},
        company: {select: {name: true}},
      },
    });

    const formattedIncidents = incidents.map (incident => {
      return {
        id: incident.id,
        reportername: incident.reportername,
        reporterphone: incident.reporterphone,
        employeeHistory: incident.employeeHistory,
        incidents: incident.incidents,
        incidentDate: incident.incidentDate,
        incidentMagnitude: incident.incidentMagnitude,
        note: incident.note,
        Attachments: incident.Attachments,
        status: incident.status,
        createdAt: incident.createdAt,
        updatedAt: incident.updatedAt,

        employeeIdNo: incident.employee.idNumber,
        employeeFistname: incident.employee.firstName,
        employeeLastname: incident.employee.lastName,
        companyName: incident.company.name,
      };
    });

    return res.status (200).json ({incidentslist: formattedIncidents});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth went wrong'});
  }
};

exports.Approve = async (req, res) => {
  const {id} = req.query;
  try {
    const isReject = await prisma.incidentReports.findUnique ({
      where: {id: id, status: 'Approved'},
    });
    if (isReject) {
      return res.status (401).json ({message: 'Incident Already Approved'});
    }

    const IncidentReport = await prisma.incidentReports.update ({
      where: {id: id},
      data: {status: 'Approved'},
    });
    await prisma.reportTracker.update ({
      where: {employeeId: IncidentReport.employeeId},
      data: {status: 'Guilty', guilty: {increment: 1}},
    });

    return res.status (200).json ({message: 'Reported Approved Successfully'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth went wrong'});
  }
};

exports.Reject = async (req, res) => {
  const {id} = req.query;
  try {
    const isReject = await prisma.incidentReports.findUnique ({
      where: {id: id, status: 'Rejected'},
    });
    if (isReject) {
      return res.status (401).json ({message: 'Incident Already Rejected'});
    }

    const IncidentReport = await prisma.incidentReports.findUnique ({
      where: {id: id},
    });

    const findIncidentReport = await prisma.incidentReports.findUnique ({
      where: {id: id, status: 'Approved'},
    });
    const findIncidentReports = await prisma.incidentReports.findMany ({
      where: {
        employeeId: IncidentReport.employeeId,
        status: 'Approved',
        NOT: {id: id},
      },
    });

    let guiltyChange = 0;

    if (findIncidentReport) {
      guiltyChange = -1;
    }

    await prisma.reportTracker.update ({
      where: {employeeId: IncidentReport.employeeId},
      data: {
        status: findIncidentReport
          ? 'Innocent'
          : findIncidentReports.length > 0 ? 'Guilty' : 'Innocent',
        guilty:{increment:guiltyChange},
      },
    });

    await prisma.incidentReports.update ({
      where: {id: id},
      data: {status: 'Rejected'},
    });
    
    return res.status (200).json ({message: 'Reported Rejected Successfully'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth went wrong'});
  }
};

exports.GetIncidentDetail = async (req, res) => {
  const {id} = req.query;
  try {
    const incident = await prisma.incidentReports.findUnique ({
      where: {id: id},
      include: {
        employee: {select: {firstName: true, idNumber: true, lastName: true}},
        company: {select: {name: true}},
      },
    });

    const employeeHistory = await prisma.employeeHistory.findUnique ({
      where: {incidentId: id},
    });

    const formattedIncidents = {
      id: incident.id,
      reportername: incident.reportername,
      reporterphone: incident.reporterphone,
      employeeHistory: incident.employeeHistory,
      incidents: incident.incidents,
      incidentDate: incident.incidentDate,
      incidentMagnitude: incident.incidentMagnitude,
      note: incident.note,
      Attachments: incident.Attachments,
      status: incident.status,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,

      employeeIdNo: incident.employee.idNumber,
      employeeFirstname: incident.employee.firstName,
      employeeLastname: incident.employee.lastName,
      companyName: incident.company.name,

      jobTitle: employeeHistory.jobTitle,
      startDate: employeeHistory.startDate,
      endDate: employeeHistory.endDate,
      workstatus: employeeHistory.status,
    };
    return res.status (200).json ({detail: formattedIncidents});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth went wrong'});
  }
};
