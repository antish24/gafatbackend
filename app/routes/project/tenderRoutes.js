// routes/tenderRoutes.js
const express = require('express');
//const tenderController = require('../controllers/tenderController');
const {
  getAllTenders,
  createTender,
  updateTender,
  deleteTender,
  updateTenderStatus,
} = require('../../controller/project/tenderController');

const router = express.Router();

router.get('/all', getAllTenders);
router.post('/create', createTender);
router.put('/:id', updateTender);
router.delete('/:id', deleteTender);
router.patch('/tender/:id', updateTenderStatus);


module.exports = router;
