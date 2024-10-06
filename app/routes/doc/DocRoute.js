const express=require('express')
const router=express.Router()
const Controller=require('../../controller/doc/DocController') 

router.post('/type/new',Controller.NewDocType)
router.get('/type/all',Controller.AllDocType)
router.get('/all',Controller.AllDoc)
router.post('/new',Controller.NewDocFile)

module.exports=router