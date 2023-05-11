const express = require('express');
const app = express();
const cors = require('cors');
const cookieparser  = require("cookie-parser");
const CNProject = require("./code.js")
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path : './config/.env'});
app.use(express.json());

app.use(cookieparser());
            
const PORT = process.env.PORT || 4000;
app.use(cors({
   origin:["http://localhost:3000"],
    method : ["GET","POST"],
    credentials:true,
}))

app.use('/v1/api/', (req,res,next)=>{
const {email ,password} = req.body;
  try {
    console.log(email);
    const encrypted = CNProject.encrypt(password);
    console.log("Encrypted:", encrypted);
    const decrypted = CNProject.decrypt(encrypted);
    console.log("Decrypted:", decrypted);
  	res.cookie('myCookie', encrypted);
  	res.send('Cookie set successfully!');
	
  } catch (error) {
    console.error('Example usage error:', error);
  }
});


app.listen(PORT, ()=>
{
    console.log(`This is in ${PORT} mode`);
})
