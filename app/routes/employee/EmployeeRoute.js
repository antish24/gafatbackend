const express=require('express')
const router=express.Router()
const EmployeeController=require('../../controller/employee/EmployeeController') 
const auth=require('../../middleware/auth')


router.post('/new',EmployeeController.NewEmployee)
router.get('/all',EmployeeController.AllEmployee)

module.exports=router