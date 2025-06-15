const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/usersRoutes');

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json()); //request body parsing
app.use('/api/users', userRoutes);

const port = process.env. port||5000;
// mongodb connection create
mongoose
     .connect(process.env.MONGO_URI, {useNewUrlParser: true,useUnifiedTopology: true,})
     .then(() => { console.log('MongoDB connected'); 
        app.listen(port, () =>console.log(`Server running on port ${port}`));
     }) .catch((error) => console.error('MongoDB connection error:', error));
          

