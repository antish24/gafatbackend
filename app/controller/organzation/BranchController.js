const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient ();

async function GenerateIdNo (prefixname) {
  // Get last id doc
  const lastDoc = await prisma.branch.findFirst ({
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
  });

  if (!lastDoc) return prefixname;
  // Extract code and number
  const code = lastDoc.IDNO.split ('-')[0];
  let number = lastDoc.IDNO.split ('-')[1];

  // Increment number
  number = parseInt (number) + 1;

  // Pad with zeros
  number = number.toString ().padStart (5, '0');

  // Return new id
  return code + '-' + number;
}

exports.AllBranch = async (req, res) => {
  try {
    const branchs = await prisma.branch.findMany ();
    return res.status (200).json ({branchs});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewBranch = async (req, res) => {
  const {name, city, subCity, wereda} = req.body;

  try {
    const IDNO = await GenerateIdNo ('BRHR-00001');
    const FindBranchName=await prisma.branch.findFirst({where:{name:{contains:name}}})
    if (FindBranchName) {
    return res.status (401).json ({message: 'Branch Name Exist'});
    }  
    await prisma.branch.create ({
      data: {
        IDNO: IDNO,
        name,
        city,
        subCity,
        wereda,
      },
    });

    return res.status (200).json ({message: 'Branch Created'});
  } catch (error) {
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};
