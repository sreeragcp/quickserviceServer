import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './config/db.js';
import partnerRoute from './routes/partnerRoute.js';
import userRoute from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cloudinary from 'cloudinary';

  cloudinary.v2.config({
    cloud_name: "dvaxt1kn8" ,
    api_key: "384571447232285",
    api_secret:"WNMGc_GnTieJ9kwL6Iqh36kWyTQ"
  });

dotenv.config();
const app = express();
const port = process.env.PORT;



//middleware
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(cookieParser())

app.use('/admin',adminRoute)
app.use('/partner',partnerRoute)
app.use('/',userRoute)






connectDB()
app.listen(port,()=>{
    console.log(`server start at port no.${port}`)
})



