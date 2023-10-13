import mongoose from "mongoose";

const partnerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  password:{
    type:String,
    required:true
  },
  aadhar:{
    type:String,
    // required:true
  },
  liscense:{
    type:String,
    // required:true
  },
  insurance:{
    type: String,
    // required:true
  },
  rcFile:{
    type: String,
    // required:true
  },
  state:{
    type: String,
    required:true
  },
  city:{
    type:String,
    required:true
  },
  pin:{
    type:Number,
    required:true
  },
  vehicle:{
    type:String,
    required:true
  }
});

const Partner = mongoose.model("Partner",partnerSchema)

export default Partner