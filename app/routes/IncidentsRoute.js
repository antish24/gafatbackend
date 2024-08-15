const express=require('express')
const router=express.Router()
const IncidentsController=require('../controller/IncidentsController') 
const auth=require('../middleware/auth')

/**
 * @api {post} /incidents/new create new incident report
 * @apiName Create New Incidents Report
 * @apiGroup Incidents
 *
 * @apiDescription Filter Business by Categories also using rate ,location,subCategories
 * 
 * @apiBody {String} idNumber Employee Id Number.
 * @apiBody {String} firstName Employee Fisrt Name.
 * @apiBody {String} lastName Employee Last Name.
 * @apiBody {String} gender  Employee Gender ('Male' 'Female').
 * @apiBody {DateTime} dateOfBirth Employee Date of Birth.
 * @apiBody {String} [mobile] Employee Mobile Number.
 * 
 * @apiBody {String} name Company or Employee Name.
 * @apiBody {String} type Company or Employee Type.
 * @apiBody {String} email Company or Employee Email.
 * @apiBody {String} phone  Company or Employee Phone Number.
 * @apiBody {String} tinNumber  Company or Employee TIN Number.
 * @apiBody {String} licenseNumber  Company or Employee license Number.
 * 
 * @apiBody {String} jobTitle  Employee Current Job Title.
 * @apiBody {DateTime} startDate  Employee Start Date for the Job.
 * @apiBody {DateTime} endDate  Employee End Date for the Job.
 * @apiBody {String} status  Employee vs Company Status ('Active', 'InActive).
 * 
 * @apiBody {String} reportername Reporter Full Name.
 * @apiBody {String} [reporterphone] Reporter Mobile Number.
 * @apiBody {String} incidents Incidents.
 * @apiBody {Enum} incidentMagnitude  Incident Magnitude ('High', 'Medium').
 * @apiBody {DateTime} incidentDate Date of the Incident.
 * @apiBody {String} note Note and Description About Incident.
 * @apiBody {File}  attachment Image File Attachment ('PNG', 'JPG').
 * 
 * @apiSuccess (200) message  Incident Reported Successfully.
 * 
 * @apiError (500 Internal Server Error) message Error message.
 */

router.post('/new',IncidentsController.NewIncident)
router.get('/all',IncidentsController.GetIncidents)
router.get('/detail',IncidentsController.GetIncidentDetail)
router.get('/approve',IncidentsController.Approve)
router.get('/reject',IncidentsController.Reject)

module.exports=router