// app/routes/planRoutes.js
const express = require('express');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { 
  getAllPlans,
  getAllCompanies,  // Import the new function
  createPlan,
  updatePlan,
  deletePlan,
  updatePlanStatus,
} = require('../../controller/project/planController');

const router = express.Router();

router.get('/plans', getAllPlans);
router.get('/companies', getAllCompanies); // Add the route for companies
router.post('/plan/add', createPlan);
// router.post('/plan/add', upload.array('attachments'), createPlan);
router.put('/plan/:id', updatePlan);
router.delete('/plan/:id', deletePlan);
router.put('/plan/status/:id', updatePlanStatus);

module.exports = router;
