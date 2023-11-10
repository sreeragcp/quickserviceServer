import mongoose from "mongoose";

const bookingHistorySchema = mongoose.Schema({
    debit:{
        type:String,
        // required:true
    },
    credit:{
        type:String,
        // required:true
    },
    amount:{
        type:Number
    },
    status:{
        type:String,
        default:"booking"
    }

})

const BookingHistory =mongoose.model("BookingHistoty",bookingHistorySchema)

export default BookingHistory
