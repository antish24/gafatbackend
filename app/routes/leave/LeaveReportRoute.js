const express=require('express')
const router=express.Router()
const Controller=require('../../controller/leave/ReportController') 

router.get('/yearlyleaves',Controller.Yearly)
router.get('/orgwise',Controller.OrgWise)
router.get('/yearlydays',Controller.Days)

module.exports=router