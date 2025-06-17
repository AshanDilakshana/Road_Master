const mongoose = require('mongoose');
const ReportIssue = require('../models/ReportIssue');

const getReportIssues = async (req, res) => {
    try{ 
    const ReportIssue = await ReportIssue.find();
    res.status(200);
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching report issues', error: error.message});
    }
};

const  createReportIssue = async (req, res) => {
    try{
        const newRoprtIssue = new ReportIssue(req.body);
        await newRoprtIssue.save();
        res.status(201)
        .json({message: 'Report issue created successfully', data: newRoprtIssue});
    }
    catch(err){
        res.status(500).json({message: 'Error creating report issue', error: err.message});
    }

};

const dleteReportIssue = async(req,res)=>{
    try{
        const {id}= req.params;
        const dleteReportIssue =  await ReportIssue.findbyIdAndDelete(id);
        if(!dleteReportIssue){
            return res.status(404)
            .json({message: 'Report issue not found'});
        }
        res.status(200)
        .json({message: 'Report issue deleted successfully'});
       }
       catch(err){
        res.status(500)
        .json({message: 'Error deleting report issue', error: err.message});
       }
};


const updateReportIssue = async (req, res) => {
    try{
        const {id} = req.params;
        const updateReportIssue = await ReportIssue.findByIdAndUpdate(id, req.body, {new: true});
        if(!updateReportIssue){
            res.status(404)
            .json({message: 'Report issue not found'});
        }res.status(200)
        .json({message: 'Report issue updated successfully', data: updateReportIssue});
    }catch(err){
        res.status(500)
        .json({message: 'Error updating report issue', error: err.message});
    }   
};

module.exports = {getReportIssues, createReportIssue, dleteReportIssue, updateReportIssue};