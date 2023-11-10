import mongoose from "mongoose";

const vehicleSchema = mongoose.Schema({
    vehicle:{
        type:String,
        required:true  
    },
    Image:{
        type:String,
        required:true
    },
    minWeight:{
        type:Number,
        required:true
    },
    maxWeight:{
        type:Number,
        required:true
    },

    pricePerKm:{
        type:Number,
        required:true
    }

})

const Vehicle = mongoose.model("Vehicle",vehicleSchema)

export default Vehicle;