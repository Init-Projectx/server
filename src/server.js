const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = { app, server };