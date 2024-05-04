const express= require('express');
const app= express();
const port= process.env.PORT || 5000;
require('dotenv').config();
app.use(express.json());
const dponfig=require('./config/dbConfig');
const usersRouter=require('./routes/userRoutes');
const examRouter=require('./routes/examRouter');
const reportRouter=require('./routes/reportRouter');
app.use("/api/users",usersRouter);
app.use("/api/exams",examRouter);
app.use("/api/reports",reportRouter);
app.listen(port,()=>{ 
    console.log(`its running on port ${port}`);   
});
const path = require("path");
app.get("/", (req, res) => {
app.use(express.static(path.resolve(__dirname, "frontend", "build")));
res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

    