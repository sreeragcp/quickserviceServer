import mongoose from "mongoose";

const bookingHistorySchema = mongoose.Schema({
  debited:{
    type:String,
    
  },
  credited:{
    type:String
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const BookingHistory = mongoose.model("BookingHistoty", bookingHistorySchema);

export default BookingHistory;
