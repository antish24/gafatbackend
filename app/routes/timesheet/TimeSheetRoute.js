const express=require('express')
const router=express.Router()
const Controller=require('../../controller/timesheet/TimeSheetController') 

router.get('/getform',Controller.TimeSheetForm)
router.post('/update',Controller.TimeSheetFormUpdate)
router.get('/detail',Controller.TimeSheetFormDetail)

router.get('/all',Controller.TimeSheetData)
router.get('/test',Controller.TestDelete)

module.exports=router