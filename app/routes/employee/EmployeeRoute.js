const express=require('express')
const router=express.Router()
const EmployeeController=require('../../controller/employee/EmployeeController') 
const auth=require('../../middleware/auth')


router.post('/hire',EmployeeController.HireEmployee)
router.post('/new',EmployeeController.NewEmployee)
router.get('/all',EmployeeController.AllEmployee)
router.get('/detail/personalinfo',EmployeeController.EmployeePersonalInfo)
router.get('/names',EmployeeController.AllEmployeeNames)
router.get('/find',EmployeeController.FindEmployeeNames)

router.post('/agreement/new',EmployeeController.NewAgreement)
router.get('/agreement/all',EmployeeController.AllAgreement)
router.post('/agreement/update',EmployeeController.UpdateAgreement)
router.get('/agreement/detail',EmployeeController.AgreementDetail)

router.post('/discipline/new',EmployeeController.NewDiscipline)
router.get('/discipline/all',EmployeeController.AllDiscipline)
router.get('/discipline/detail',EmployeeController.DisciplineDetail)

module.exports=router