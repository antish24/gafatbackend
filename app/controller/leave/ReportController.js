const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.Yearly = async (req, res) => {
  const { year, status } = req.query;

  try {
    const currentYear = new Date(year).getFullYear() || new Date().getFullYear();
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    // Fetch leaves filtered by status and within the specified year
    const list = await prisma.leaveApplication.findMany({
      where: {
        status: status || 'Approved', // Use 'Approved' if status is not provided
        createdAt: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
    });

    // Array representing months
    const months = [
      'January', 'February', 'March', 'April', 
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December',
    ];

    // Initialize the report with a count of 0 for each month
    const monthlyReport = months.map((month) => ({
      month,
      leaveCount: 0,
    }));

    // Group leaves by month
    list.forEach((leave) => {
      const monthIndex = new Date(leave.createdAt).getMonth(); 
      monthlyReport[monthIndex].leaveCount++;
    });

    return res.status(200).json({ report: monthlyReport });
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    return res.status(500).json({ message: 'Failed to retrieve leave report' });
  }
};

exports.OrgWise = async (req, res) => {
  const { year, status, branchId, departmentId, positionId } = req.query; // Accept branchId, departmentId, and positionId

  try {
    const currentYear = year ? new Date(year).getFullYear() : new Date().getFullYear();
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    // Construct the where clause with optional filters
    const whereClause = {
      status: status || 'Approved', // Default to 'Approved' if not provided
      createdAt: {
        gte: startOfYear,
        lte: endOfYear,
      },
      employee: {
        workDetail: {
          ...(positionId && { positionId }), // Filter by positionId if provided
          ...(departmentId && { position: { departmentId } }), // Filter by departmentId if provided
          ...(branchId && { position: { department: { branchId } } }), // Filter by branchId if provided
        },
      },
    };

    // Fetch leaves filtered by the constructed where clause
    const list = await prisma.leaveApplication.findMany({
      where: whereClause,
      include: {
        employee: {
          include: {
            workDetail: {
              include: {
                position: {
                  include: {
                    department: {
                      include: {
                        branch: true, // Include branch information if needed
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Array representing months
    const months = [
      'January', 'February', 'March', 'April', 
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December',
    ];

    // Initialize the report with a count of 0 for each month
    const monthlyReport = months.map((month) => ({
      month,
      leaveCount: 0,
    }));

    // Group leaves by month
    list.forEach((leave) => {
      const monthIndex = new Date(leave.createdAt).getMonth(); 
      monthlyReport[monthIndex].leaveCount++;
    });

    return res.status(200).json({ report: monthlyReport });
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    return res.status(500).json({ message: 'Failed to retrieve leave report' });
  }
};


exports.Days = async (req, res) => {
  const { year } = req.query;

  try {
    const currentYear = year ? new Date(year).getFullYear() : new Date().getFullYear();
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const list = await prisma.leaveApplication.findMany({
      where: {
        status: 'Approved',
        createdAt: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
    });

    console.log('Leave Applications:', list);

    const months = [
      'January', 'February', 'March', 'April', 
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December',
    ];

    const monthlyReport = months.map((month) => ({
      month,
      totalDays: 0,
    }));

    if (list.length === 0) {
      return res.status(200).json({ report: monthlyReport });
    }

    // Simplified logic: just distribute totalDays across months
    list.forEach((leave) => {
      const totalDays = leave.totalDay;

      const startMonthIndex = new Date(leave.startDate).getMonth();
      const endMonthIndex = new Date(leave.endDate).getMonth();

      for (let monthIndex = startMonthIndex; monthIndex <= endMonthIndex; monthIndex++) {
        // Directly add totalDays to the respective month
        monthlyReport[monthIndex].totalDays += totalDays;
      }
    });

    console.log('Monthly Report:', monthlyReport);
    return res.status(200).json({ report: monthlyReport });
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    return res.status(500).json({ message: 'Failed to retrieve leave report' });
  }
};





