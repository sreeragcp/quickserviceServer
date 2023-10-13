import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
    
    city:{
        type: String,
        required:true 
    },
    status:{
        type:Boolean,
        default:true
    },
    image:{
        type:String,
        required:true
    },

});
  
const Service = mongoose.model("Service",serviceSchema);

export default Service;
