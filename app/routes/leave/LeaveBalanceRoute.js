const express=require('express')
const router=express.Router()
const Controller=require('../../controller/leave/BalanceController') 

router.get('/all',Controller.AllBalance)
router.post('/update',Controller.UpdateBalanceDetail)
router.get('/detail',Controller.BalanceDetail)

module.exports=router