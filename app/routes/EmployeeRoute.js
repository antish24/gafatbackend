const express=require('express')
const router=express.Router()
const EmployeeController=require('../controller/EmployeeController') 
const auth=require('../middleware/auth')

router.get('/getall',EmployeeController.AllEmployee)
router.get('/search',EmployeeController.SearchEmployee)

module.exports=router