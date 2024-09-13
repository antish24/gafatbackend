const express=require('express')
const router=express.Router()
const VacancyController=require('../../controller/vacancy/VacancyController') 
const auth=require('../../middleware/auth')


router.post('/new',VacancyController.NewVacancy)
router.get('/all',VacancyController.AllVacancy)

module.exports=router