const express=require('express')
const router=express.Router()
const authController=require('../controller/AuthController') 
const auth=require('../middleware/auth')

router.get('/login',authController.Login)
router.get('/logout',authController.Logout)
router.post('/forget',authController.Forget)

module.exports=router