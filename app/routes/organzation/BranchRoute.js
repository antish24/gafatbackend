const express=require('express')
const router=express.Router()
const BranchController=require('../../controller/organzation/BranchController') 
const auth=require('../../middleware/auth')


router.post('/new',BranchController.NewBranch)
router.get('/all',BranchController.AllBranch)

module.exports=router