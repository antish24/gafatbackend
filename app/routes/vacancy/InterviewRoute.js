const express=require('express')
const router=express.Router()
const InterviewController=require('../../controller/vacancy/InterviewController') 
const auth=require('../../middleware/auth')


router.post('/new',InterviewController.NewInterview)
router.get('/find',InterviewController.FindInterview)
router.get('/all',InterviewController.AllInterview)
router.get('/detail',InterviewController.InterviewDetail)
router.post('/update',InterviewController.InterviewUpdate)
router.post('/applicant',InterviewController.InterviewApplicant)

module.exports=router