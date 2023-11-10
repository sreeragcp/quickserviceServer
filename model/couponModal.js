import mongoose from "mongoose";

const couponSchema = mongoose.Schema({

    couponCode:{
        type:String,
        required:true
    },
    discount:{
        type:String,
        required:true
    },
    maxDiscount:{
        type:String,
        required:true
    },
    expiryDate:{
        type:String,
        required:true
    }
})

const Coupon = mongoose.model("Coupon",couponSchema)

export default Coupon