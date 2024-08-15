const express=require('express')
const router=express.Router()

const userRoute=require('./UsersRoute')
const authRoute=require('./AuthRoute')
const IncidentsRoute=require('./IncidentsRoute')
const EmployeeRoute=require('./EmployeeRoute')

router.use('/users',userRoute)
router.use('/auth',authRoute)
router.use('/incidents',IncidentsRoute)
router.use('/employee',EmployeeRoute)

module.exports=router
