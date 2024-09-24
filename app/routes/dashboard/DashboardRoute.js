const express=require('express')
const router=express.Router()
const DashboardController=require('../../controller/dashboard/DashboardController') 


router.get('/counts',DashboardController.GetCount)

module.exports=router