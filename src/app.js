const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./routes/index.routes');
const ALLOWED_ORIGINS = process.env.CLIENT_APP_ORIGIN.split(',');
const app = express();

const corsOptions = {
    origin: ALLOWED_ORIGINS,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use('/api', router);

module.exports = app;