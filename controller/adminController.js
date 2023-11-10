import Admin from "../model/adminModel.js";
import User from "../model/userModel.js";
import Partner from "../model/partnerModel.js";
import Service from "../model/serviceModel.js";
import Vehicle from "../model/vehicleModel.js";
import Coupon from "../model/couponModal.js";
import Booking from "../model/bookingModel.js";
import cloudinary from "cloudinary";
import { ObjectId } from "mongoose";


const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const stringWithQuotes = email;
  const emailId = stringWithQuotes.replace(/"/g, "");
  try {
    const adminExist = await Admin.find({ email: emailId });

    if (adminExist) {
      res.status(201).json({ message: "success" });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const addCity = async (req, res) => {
  try {
    const city = req.body.city;
    const Image = await cloudinary.v2.uploader.upload(req.body.image);

    const cityExist = await Service.findOne({ city: city });

    if (cityExist) {
      return res.status(400).json({ error: "City already exists" });
    }

    const cityData = new Service({
      city: city,
      image: Image.url,
    });
    const newCity = await cityData.save();
    const allCity = await Service.find();
    if (allCity) {
      return res.status(201).json({ allCity: allCity, newCity });
    } else {
      return res.status(201).json({ message: "allCity not found", newCity });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const listCity = async (req, res) => {
  console.log("insd list ccity");
  try {
    const cityData = await Service.find();

    if (cityData) {
      return res.json(cityData);
    } else {
      return res.json({ message: "failed" });
    }
  } catch (error) {
    return res.json({ message: "server issue" });
  }
};

const userList = async (req, res) => {
  try {
    const userData = await User.find();
    if (userData) {
      res.json(userData);
    } else {
      res.status(404).json({ message: "No user data found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const partnersList = async (req, res) => {
  try {
    const partnerData = await Partner.find();
    if (partnerData) {
      res.json(partnerData);
    } else {
      res.status(404).json({ message: "No partner data found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const vehicle = async (req, res) => {
  try {
    const vehicle = req.body.vehicle;
    const Image = await cloudinary.v2.uploader.upload(req.body.image);
    const minWeight = req.body.minWeight;
    const maxWeight = req.body.maxWeight;
    const pricePerKm = req.body.pricePerKm

    const vehicleExist = await Vehicle.findOne({ vehicle: vehicle });

    if (vehicleExist) {
      return res.status(400).json({ error: "Vehicle already exists" });
    }

    const vehicleData = new Vehicle({
      vehicle: vehicle,
      Image: Image.url,
      minWeight: minWeight,
      maxWeight: maxWeight,
      pricePerKm:pricePerKm
    });

    const newVehicle = await vehicleData.save();

    if (newVehicle) {
      return res.status(201).json(newVehicle);
    } else {
      return res.status(201).json({ message: "new vehicle is not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const vehicleList = async (req, res) => {
  try {
    const vehicleData = await Vehicle.find();
    if (vehicleData) {
      res.json(vehicleData);
    } else {
      res.status(404).json({ message: "No vehicle data found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyPartner = async(req,res)=>{
  try {
    const partnerId = req.body.partnerId
    const partner = await Partner.findById(partnerId);
    if(partner){
      const partnerData = await Partner.findByIdAndUpdate(
        { _id: partnerId },
        { $set: { is_verified: true } },
        { new: true }
      )
      res.json(partnerData)
    }
  } catch (error) {
    console.log(error.message);
  }
}

const addCoupon = async(req,res)=>{
  console.log('inside the addcoupon');
  try {
    console.log(req.body,"this is the reqbody");
    const couponCode = req.body.couponCode
    const discount = req.body.discount
    const maxDiscount = req.body.maxDiscount
    const expiryDate = req.body.expiryDate

    const couponExist = await Coupon.findOne({ couponCode: couponCode });

    if (couponExist) {
      return res.status(400).json({ error: "Coupon already exists" });
    }

    const couponData = new Coupon({
      couponCode: couponCode,
      discount: discount,
      maxDiscount: maxDiscount,
      expiryDate: expiryDate,
    });

    const newCoupon = await couponData.save();

    if (newCoupon) {
      return res.status(201).json(newCoupon);
    } else {
      return res.status(201).json({ message: "new Coupon not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
}

const couponList = async(req,res)=>{
  console.log("inside the couponList");
  try {
    const couponData = await Coupon.find();
    if (couponData) {
      res.json(couponData);
    } else {
      res.status(404).json({ message: "No coupon data found" });
    }
    
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const detailsBooking = async(req,res)=>{
  try {
    // const details = await Booking.find()
    const details = await Booking.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData"
        }
      },
      {
        $lookup: {
          from: "partners",
          localField: "partnerId",
          foreignField: "_id",
          as: "partnerData"
        }
      },
      {
        $unwind: "$userData"   // Unwind the 'userData' array
      },
      {
        $unwind: "$partnerData"  // Unwind the 'partnerData' array
      }
    ]);
    
    
    
    if(details){
 
      res.json(details)
    }
    else{
      console.log("no data");
      res.status(404).json({ message: "No booking data found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const bookingData = async(req,res)=>{
  try {
    const bookingId = req.params.id
      const bookingData = await Booking.findOne({_id:bookingId})
    
    if (bookingData) {
      console.log(bookingData, "this is the details");
      res.json(bookingData); 
    } else {
      console.log("no data");
      res.status(404).json({ message: "No booking data found" });
    }

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export default {
  adminLogin,
  addCity,
  listCity,
  userList,
  partnersList,
  vehicle,
  vehicleList,
  verifyPartner,
  addCoupon,
  couponList,
  detailsBooking,
  bookingData
};
