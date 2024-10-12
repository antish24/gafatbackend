const express=require('express')
const router=express.Router()
const UsersController=require('../../controller/users/UsersController') 

router.get('/all',UsersController.AllUsers)
router.get('/detail',UsersController.UserDetail)
router.post('/update',UsersController.UpdateDetail)
router.get('/ban',UsersController.BanUser)
router.get('/delete',UsersController.DeleteUser)
router.post('/new',UsersController.NewUser)

module.exports=router