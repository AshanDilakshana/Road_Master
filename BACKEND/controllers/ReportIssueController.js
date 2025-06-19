const mongoose = require('mongoose');
const ReportIssue = require('../models/ReportIssue');

const getAllReportIssues = async (req, res) => {
    try{ 
    const reportIssues = await ReportIssue.find();
    res.status(200)
    .json({message: 'Report issues fetched successfully', data: reportIssues});
    }
    catch (error) {
        res.status(500)
        .json({message: 'Error fetching report issues', error: error.message});
    }
};

//get spesipic user datails
const getReportIssueByEmail = async (req, res) => {
    try{
        if (!req.params.email) {
            return res.status(400)
            .json({message: 'Email parameter is required'});}
            
        const reportIssue = await ReportIssue.findOne({ email: req.params.email });
        res.status(200)
        .json({message: 'Report issue fetched successfully', data: reportIssue});
    }catch (error) {
        res.status(500)
        .json({message: 'Error fetching report issue', error: error.message});
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

module.exports = {getAllReportIssues,getReportIssueByEmail ,createReportIssue, dleteReportIssue, updateReportIssue};