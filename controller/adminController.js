import Admin from "../model/adminModel.js";
import User from "../model/userModel.js";
import Partner from "../model/partnerModel.js";
import Service from "../model/serviceModel.js";
import Vehicle from "../model/vehicleModel.js";
import Coupon from "../model/couponModal.js";
import Booking from "../model/bookingModel.js";
import cloudinary from "cloudinary";
import { ObjectId } from "mongoose";
import { generateAdminToken } from "../utils/generateUserToken.js";


const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const stringWithQuotes = email;
  const emailId = stringWithQuotes.replace(/"/g, "");
  try {
    const adminExist = await Admin.findOne({ email: emailId });
    const tocken = generateAdminToken(adminExist);
    if (adminExist) {
      res.status(201).json({ message: "success", admin:adminExist});
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
  try {
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
      res.json(bookingData); 
    } else {
      res.status(404).json({ message: "No booking data found" });
    }

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const fetchPartner = async(req,res)=>{
  try {
    const partnerId = req.params.id
    const parterData = await Partner.findOne({_id:partnerId})
    if(parterData){
      res.json(parterData)
    }
    else{
      res.status(404).json({ message: "No partner data found" });
    }
  
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const getGraphDetails = async(req,res)=>{
  const currentdate = new Date();
  try {

    const data = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalAmount: { $sum: "$totalPrice" }
        }
      }
    ]);

    const result = {
      totalBookings: data[0].totalBookings,
      totalAmount: data[0].totalAmount
    };


    const datas = await Booking.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$bookingDate" },
            year: { $year: "$bookingDate" }
          },
          totalBookings: { $sum: 1 },
          totalAmount: { $sum: "$totalPrice" }
        }
      },
      {
        $match: {
          "_id.month": new Date().getMonth() + 1, // Adding 1 because months are zero-based
          "_id.year": new Date().getFullYear()
        }
      },
      {
        $project: {
          _id: 0,
          totalBookings: 1,
          totalAmount: 1
        }
      }
    ]);
    

    res.json({result,datas});

    // const data = await Booking.aggregate([
    //   {
    //     $group: {
    //       _id: {
    //         day: { $dayOfMonth: "$createdAt" },
    //         month: { $month: "$createdAt" },
    //         year: { $year: "$createdAt" }
    //       },
    //       totalAmount: { $sum: "$amount" }
    //     }
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       date: {
    //         $dateToString: {
    //           format: "%d/%m/%Y",
    //           date: {
    //             $dateFromParts: {
    //               year: "$_id.year",
    //               month: "$_id.month",
    //               day: "$_id.day"
    //             }
    //           }
    //         }
    //       },
    //       totalAmount: 1
    //     }
    //   }
    // ]);
    
  } catch (error) {
    
  }
}

const getBookingDetails = async(req,res)=>{

  const currentdate = new Date();
  try {

    const data = await Partner.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalUsers: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $group: {
          _id: null,
          monthlyData: { $push: { month: "$_id.month", year: "$_id.year", totalUsers: "$totalUsers" } },
        },
      },
      {
        $project: {
          _id: 0,
          monthlyData: 1,
        },
      },
    ]);

    // console.log(data[0].monthlyData,"this is the month");

    res.json(data.length > 0 ? data[0].monthlyData[1] : []);
    // const data = await Booking.aggregate([
    //   {
    //     $group: {
    //       _id: {
    //         month: { $month: "$bookingDate" },
    //         year: { $year: "$bookingDate" },
    //       },
    //       totalBookings: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $sort: {
    //       "_id.year": 1,
    //       "_id.month": 1,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       monthlyData: { $push: { month: "$_id.month", year: "$_id.year", totalBookings: "$totalBookings" } },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       monthlyData: 1,
    //     },
    //   },
    // ]);

    // res.json(data.length > 0 ? data[0].monthlyData : []);
    
  } catch (error) {

       res.status(500).json({ message: "Internal Server Error" });
  }
}
 

const getUserRegister = async(req,res)=>{
  try {
    const data = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalUsers: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $group: {
          _id: null,
          monthlyData: { $push: { month: "$_id.month", year: "$_id.year", totalUsers: "$totalUsers" } },
        },
      },
      {
        $project: {
          _id: 0,
          monthlyData: 1,
        },
      },
    ]);

    // console.log(data[0].monthlyData,"this is the month");

    res.json(data.length > 0 ? data[0].monthlyData[1] : []);
  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    
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
  bookingData,
  fetchPartner,
  getGraphDetails,
  getBookingDetails,
  getUserRegister
};
