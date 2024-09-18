const db = require ('../../config/db');
// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const bcrypt = require ('bcrypt');
const prisma = new PrismaClient ();

async function GenerateIdNo (prefixname) {
  // Get last id doc
  const lastDoc = await prisma.interview.findFirst ({
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

exports.AllInterview = async (req, res) => {
  try {
    const interviews = await prisma.interview.findMany ();
    return res.status (200).json ({interviews});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.InterviewDetail = async (req, res) => {
  const {id} = req.query;
  try {
    const interview = await prisma.interview.findUnique ({where: {IDNO: id}});
    const interviewQ = await prisma.question.findMany({where: {interviewId: interview.id}});

    return res.status (200).json ({interview,interviewQ});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewInterview = async (req, res) => {
  const {title, questions} = req.body;

  try {
    const IDNO = await GenerateIdNo ('IVHR-00001');
      const interview=await prisma.interview.create ({
        data: {
          IDNO: IDNO,
          title,
        },
      })

      questions.forEach (async(question) => {
        await prisma.question.create ({
          data: {
            name: question.name,
            minValue:parseInt(question.min),
            maxValue: parseInt(question.max),
            interview: {
              connect: {id: interview.id},
            },
          },
        });
      })

    return res.status (200).json ({message: 'Interview Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

exports.InterviewApplicant = async (req, res) => {
  const {questions,applicant} = req.body;

  try {
      const interviewScore=await prisma.applicant.update({where:{id:applicant},
        data: {
          status:'Waiting',
          totalScore:parseInt(questions.reduce((acc, q) => {
            return acc + +q.score;
          }, 0)),
          maxScore:parseInt(questions.reduce((acc, q) => {
            return acc + +q.max;
          }, 0)),
        },
      })

      await prisma.applicantInterview.deleteMany({where:{applicantId:interviewScore.id}})
      
      questions.forEach (async(question) => {
        await prisma.applicantInterview.create ({
          data: {
            questions: question.name,
            score:parseInt(question.score),
            max:parseInt(question.min),
            min: parseInt(question.max),
            applicant: {
              connect: {id: interviewScore.id},
            },
          },
        });
      })

    return res.status (200).json ({message: 'Applicant Interview Saved'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};

exports.InterviewUpdate = async (req, res) => {
  const {title, questions,IDNO} = req.body;

  try {
      const interview=await prisma.interview.update ({
        where: {IDNO: IDNO},
        data: {
          title,
        },
      })

      await prisma.question.deleteMany({where:{interviewId:interview.id}})

      questions.forEach (async(question) => {
        await prisma.question.create ({
          data: {
            name: question.name,
            minValue:parseInt(question.min),
            maxValue: parseInt(question.max),
            interview: {
              connect: {id: interview.id},
            },
          },
        });
      })

    return res.status (200).json ({message: 'Interview Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};
