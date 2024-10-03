const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify folder for uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

exports.createCompany = [
  async (req, res) => {
    try {
      const { name, TIN, VAT,license,profile, city, subCity, wereda, houseNo, phone, email,kebele, } = req.body;

      // Create the company record using Prisma
      const newCompany = await prisma.company.create({
        data:{
          name,TIN,VAT,license,profile,phone,email
        },
      });

      await prisma.companyAddress.create({
        data: {
          wereda,kebele,city,subCity,houseNo,companyId:newCompany.id
        },
      });

      res.status(201).json({ message: 'Company created successfully'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create company', error });
    }
  },
];


// Update a company by ID
// Update a company and its address by ID
exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, address } = req.body; // Destructure company and address data from request
    console.log(address)
    // Update company data
    const updatedCompany = await prisma.company.update({
      where: { id },
      data: company,
    });

    // Update company address data
    const updatedCompanyAddress = await prisma.companyAddress.update({
      where: { companyId: id }, // Use companyId to match the related address
      data: {
        city: address.city || '',
        subCity: address.subCity || '',
        wereda: address.wereda || '', // Use 'wereda' instead of 'woreda'
       // kebele: address.kebele || '',
        houseNo: address.houseNo || '',
      },
    });

    res.status(200).json({
      message: 'Company and address updated successfully',
      company: updatedCompany,
      address: updatedCompanyAddress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating company and address', error });
  }
};




// Create a new company
// exports.createCompany = async (req, res) => {
//   try {
//     const { name, location } = req.body;

//     // Create the company record using Prisma
//     const newCompany = await prisma.company.create({
//       data: {
//         name,
//         location,
//         createdAt: new Date()
//       },
//     });

//     res.status(201).json({ message: 'Company created successfully', data: newCompany });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to create company', error });
//   }
// };

// Get all companies
// Get all companies with address
exports.getCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        companyAddress: true, // Include the related company address
      },
    });
    res.status(200).json({companies});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve companies', error });
  }
};


// Update a company by ID
// exports.updateCompany = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, location } = req.body;

//     const updatedCompany = await prisma.company.update({
//       where: { id: parseInt(id) },
//       data: { name, location },
//     });

//     res.status(200).json(updatedCompany);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error updating company', error });
//   }
// };

