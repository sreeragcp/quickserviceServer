import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    booker_name:{
        type:String,
        required:true
    },
    booker_Mobile:{
        type:String,
        required:true
    },
    partnerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    pickUpPoint:{
        type:String,
        required:true
    },
    dropPoint:{
        type:String,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:"pending"
    },
    is_canceled:{
        type:Boolean,
        default:false
    },
    bookingDate:{
        type:Date,
        default:Date.now()
    }

})

const Booking =mongoose.model("Booking",bookingSchema)

export default Booking
