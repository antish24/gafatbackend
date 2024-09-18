const express=require('express')
const router=express.Router()
const VacancyController=require('../../controller/vacancy/VacancyController') 
const auth=require('../../middleware/auth')


router.post('/new',VacancyController.NewVacancy)
router.post('/update',VacancyController.UpdateVacancy)
router.get('/close',VacancyController.CloseVacancy)
router.get('/all',VacancyController.AllVacancy)
router.get('/detail',VacancyController.VacancyDetail)

router.post('/addapplicant',VacancyController.AddApplicant)
router.get('/applicants',VacancyController.VacancyApplicants)
router.get('/applicantdetail',VacancyController.ApplicantDetail)

module.exports=router