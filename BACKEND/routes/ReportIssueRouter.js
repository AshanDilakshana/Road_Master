const mongoose = require('mongoose');
const {getAllReportIssues,getReportIssueByEmail ,createReportIssue, dleteReportIssue, updateReportIssue,getReportIssueById, getReportIssuesByProvinceAdmin} = require('../controllers/ReportIssueController');
const express = require('express');
const router = express.Router();


router.get('/GetAllreport', getAllReportIssues);
router.get('/Getreport', getReportIssueByEmail);
router.get('/GetreportById/:id', getReportIssueById);
router.post('/reportIssues_create', createReportIssue);
router.delete('/reportIssues_delete/:id', dleteReportIssue);
router.put('/reportIssues_update/:id', updateReportIssue);
router.get('/GetreportByProvinceAdmin', getReportIssuesByProvinceAdmin);


module.exports = router;