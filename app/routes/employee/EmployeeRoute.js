const express=require('express')
const router=express.Router()
const EmployeeController=require('../../controller/employee/EmployeeController') 
const auth=require('../../middleware/auth')


router.post('/hire',EmployeeController.HireEmployee)
router.post('/new',EmployeeController.NewEmployee)
router.get('/all',EmployeeController.AllEmployee)
router.get('/names',EmployeeController.AllEmployeeNames)
router.get('/find',EmployeeController.FindEmployeeNames)

module.exports=router