const express=require('express')
const router=express.Router()
const Controller=require('../../controller/leave/ApplicationController') 

router.post('/new',Controller.NewApplication)
router.get('/all',Controller.AllApplication)
router.post('/update',Controller.UpdateApplicationDetail)
router.get('/detail',Controller.ApplicationDetail)
router.get('/approve',Controller.ApplicationApprove)
router.get('/fail',Controller.ApplicationFail)
router.get('/amend',Controller.ApplicationRestore)

module.exports=router