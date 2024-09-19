const express=require('express')
const router=express.Router()
const SalaryController=require('../../controller/salary/SalaryController') 

router.post('/components/new',SalaryController.NewComponents)
router.get('/components/all',SalaryController.AllComponents)

router.get('/assignment/all',SalaryController.AllAssignStructure)
router.post('/assignment/new',SalaryController.AssignStructure)

router.get('/structure/all',SalaryController.AllStructure)
router.post('/structure/new',SalaryController.NewStructure)
router.post('/structure/update',SalaryController.UpdateStructure)
router.get('/structure/detail',SalaryController.StructureDetail)

module.exports=router