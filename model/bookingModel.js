import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    booking_id:{
        type:String,
        required:true
    },
    booker_name:{
        type:String,
        required:true
    },
    booker_email:{
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
    },
    weight:{
        type:Number,
        required:true
    }

})

const Booking =mongoose.model("Booking",bookingSchema)

export default Booking
