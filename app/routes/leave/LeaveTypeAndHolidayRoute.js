const express=require('express')
const router=express.Router()
const Controller=require('../../controller/leave/TypeAndHolidayController') 

router.post('/newtype',Controller.NewType)
router.get('/alltype',Controller.AllTypes)
router.post('/updatetype',Controller.UpdateTypeDetail)
router.get('/typedetail',Controller.TypeDetail)

router.post('/newholiday',Controller.NewHoliday)
router.get('/allholiday',Controller.AllHoliday)
router.post('/updateholiday',Controller.UpdateHolidayDetail)
router.get('/holidaydetail',Controller.HolidayDetail)

module.exports=router