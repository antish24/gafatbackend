const express=require('express')
const router=express.Router()

const userRoute=require('./users/UsersRoute')

//Timesheet routes
const TimeSheetRoute=require('./timesheet/TimeSheetRoute')
const UploadRoute=require('./upload/UploadRoute')

//Timesheet routes
const ProjectRoute=require('./project/projectRoute')

//vacancy routes
const VacancyRoute=require('./vacancy/VacancyRoute')
const InterviewRoute=require('./vacancy/InterviewRoute')

//organzation routes
const businessInfoRoute=require('./organzation/businessInfoRoute')
const BranchRoute=require('./organzation/BranchRoute')
const DepartmentRoute=require('./organzation/DepartmentRoute')
const PositionRoute=require('./organzation/PositionRoute')

//employee routes
const EmployeeRoute=require('./employee/EmployeeRoute')

//employee routes
const LeaveApplicationRoute=require('./leave/LeaveApplicationRoute')
const LeaveRoute=require('./leave/LeaveTypeAndHolidayRoute')
const LeaveBalanceRoute=require('./leave/LeaveBalanceRoute')

//salary route
const SalaryRoute=require('./salary/SalaryRoute')

//payroll route
const PayrollRoute=require('./payroll/PayrollRoute')

//project route
const projectRoutes=require('./project/projectRoute')
const companyRoutes=require('./project/companyRoutes')
const planRoutes=require('./project/planRoutes')
const tenderRoutes=require('./project/tenderRoutes')

//report route
const reportRoutes=require('./report/reportRoutes')
const DocRoute=require('./doc/DocRoute')

//asset route
const InventoryRoute=require('./asset/inventory')
const RequestRoute=require('./asset/RequestRoute')

//dashboard
const DashboardRoute=require('./dashboard//DashboardRoute')
const AuthRoute=require('./AuthRoute')


router.use('/upload',UploadRoute)
router.use('/auth',AuthRoute)
router.use('/dashboard',DashboardRoute)

router.use('/users',userRoute)
router.use('/interview',InterviewRoute)
router.use('/vacancy',VacancyRoute)

router.use('/organzation/business',businessInfoRoute)
router.use('/organzation/branch',BranchRoute)
router.use('/organzation/department',DepartmentRoute)
router.use('/organzation/position',PositionRoute)

router.use('/doc',DocRoute)


router.use('/leave',LeaveRoute)
router.use('/leave/application',LeaveApplicationRoute)
router.use('/leave/balance',LeaveBalanceRoute)

router.use('/employee',EmployeeRoute)

router.use('/timesheet',TimeSheetRoute)

router.use('/project',ProjectRoute)

router.use('/salary',SalaryRoute)
router.use('/payroll',PayrollRoute)


router.use('/company', companyRoutes)
router.use('/project',projectRoutes)
router.use('/tender', tenderRoutes);
router.use('/plan', planRoutes);

router.use('/reports', reportRoutes);

router.use('/inventory',InventoryRoute)
router.use('/request', RequestRoute)

module.exports=router
