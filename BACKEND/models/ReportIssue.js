const mongoose = require('mongoose');

const reportIssueSchema = new mongoose.Schema({
    province: {
        type: String,
        required: true
    },

    district: {
        type: String,
        required: true
    },

    nearbyTown: {
        type: String,
        required: true
    },

    damageLevel: {
        type: String,
        required: true,
    },

    timeAndDate: {
        type: Date,
        required: true
    },

    emailAddress: {
        type: String,
        required: true, 
    },

    contactNumber: {
        tyep: String,
        required: true
    },

    image:{
        type: String,  
    },

    location: {
        lat: {
        type: Number,
        required: true
        },
        lng: {
        type: Number,
        required: true
        }
    },


    additionalMessage:{
        type: String,
        required: false
    }

}) ;
module.exports = mongoose.model('ReportIssue', reportIssueSchema);