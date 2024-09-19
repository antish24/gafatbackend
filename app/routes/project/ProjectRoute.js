const express=require('express')
const router=express.Router()
const ProjectController=require('../../controller/project/ProjectController') 

router.get('/all',ProjectController.AllProjects)

module.exports=router