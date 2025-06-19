const mongoose = require('mongoose');
const {getAllReportIssues, createReportIssue, dleteReportIssue, updateReportIssue} = require('../controllers/ReportIssueController');
const express = require('express');
const router = express.Router();


router.get('/GetAllreport', getAllReportIssues);
router.post('/reportIssues_create', createReportIssue);
router.delete('/reportIssues_delete/:id', dleteReportIssue);
router.put('/reportIssues_update/:id', updateReportIssue);  




module.exports = router;