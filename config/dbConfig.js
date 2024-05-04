const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);
const connection=mongoose.connection;
connection.on('connected',()=>{
    console.log('Mongodb connnection sucessfully established');
})
connection.on('error',()=>{
console.log('Mongodb connection error');
});
module.exports = connection;