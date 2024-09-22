const express = require('express');
const router = express.Router();
//const companyController = require('../../controller/companyController');
const { createCompany, getCompanies, updateCompany } = require('../../controller/project/companyController');

// Route to add a new company
router.post('/add', createCompany);

router.get('/all', getCompanies);

router.put('/:id', updateCompany);

module.exports = router;
