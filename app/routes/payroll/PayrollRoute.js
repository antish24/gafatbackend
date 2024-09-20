const express=require('express')
const router=express.Router()
const PayrollController=require('../../controller/payroll/PayrollController') 

router.get('/generate/all',PayrollController.AllGeneratedPayroll)
router.get('/generate/list',PayrollController.GeneratedPayrollList)
router.post('/generate/new',PayrollController.GenerateNewPayroll)

module.exports=router