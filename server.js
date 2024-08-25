const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');

// Security Packages
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSantize = require("express-mongo-sanitize");

// API Documentation
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("swagger-jsdoc");
const errorMiddleware = require('./middleware/errorMiddleware');
require('express-async-error');

//Dot ENV
dotenv.config({ path: './config/.env' });

//MongoDB Connection
connectDB();

// Swagger API Config 
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Job Portal Application",
            description: "Node ExpressJS Job Portal Application"
        },
        servers: [
            {
                url: "http://localhost:8080"
            },
        ]
    },
    apis: ["./routes/*.js"],
}


const spec = swaggerDoc(options);

// rest Object
const app = express();

// Middleware
app.use(helmet());
app.use(xss());
app.use(mongoSantize());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// route
app.use('/api/v1/test', require('./routes/testRoute'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/jobs', require('./routes/jobsRoutes'));

// homeroot route
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

//validation Middleware
app.use(errorMiddleware);


const PORT = process.env.PORT || 8080;
const devMode = process.env.DEV_MODE;

app.listen(PORT, () => {
    console.log(`Node Server Running in ${devMode} Mode on Port ${PORT}`);
});