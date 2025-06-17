const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/usersRoutes');
const reportIssueRoutes = require('./routes/ReportIssueRouter');

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json()); //request body parsing

app.use('/api/users', userRoutes);
app.use('/api/reportIssues', reportIssueRoutes);










const port = process.env.PORT || 8081;
// mongodb connection create
mongoose
     .connect(process.env.MONGO_URI, )
     .then(() => { console.log('MongoDB connected 🌿✅'); 
        app.listen(port, () =>console.log(`Server running on port ${port}📌`));
     }) .catch((error) => console.error('MongoDB connection error:', error));
          

