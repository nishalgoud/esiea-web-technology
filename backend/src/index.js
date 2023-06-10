const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const cors = require('cors');

const { errorHandler } = require('./middlewares');
const connectDB = require('./config/database');

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/user'));
app.use('/api/images', require('./routes/image'));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));