const monngoose = require("mongoose");

require("dotenv").config();

const dbConnect = ()=>{
    monngoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("DB connected successfully");
    })
    .catch((error)=>{
        console.log("Connection failed");
        console.error(error.message);
        process.exit(1); 
    })
}

module.exports = dbConnect;