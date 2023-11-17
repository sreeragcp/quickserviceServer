import User from "../model/userModel.js";
import Service from "../model/serviceModel.js";
import Vehicle from "../model/vehicleModel.js";
import Coupon from "../model/couponModal.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import NodeCache from "node-cache";
import { generateUserToken } from "../utils/generateUserToken.js";
import Partner from "../model/partnerModel.js";
import Booking from "../model/bookingModel.js";
import BookingHistory from "../model/bookingHistoryModel.js";
import mongoose from "mongoose";



let io;

export const hello = (i) => {
  io = i;
};

const myCache = new NodeCache();

function generateOtp() {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  myCache.set("myOtp", otp, 60000);
  return otp;
}

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const sendOtpMail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "plantorium1@gmail.com",
        pass: "lhfkxofxdfyhflkq",
      },
    });
    const mailOptions = {
      from: "plantorium1@gamil.com",
      to: email,
      subject: "your otp verification code",
      html:
        "<p> Your Quick_Service registration one time password is  " +
        otp +
        " </p>",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent :-", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const userRegister = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = generateOtp();
    console.log(otp, "this is the register otp");
    const userExist = await User.findOne({ email: req.body.email });

    if (!userExist) {
      sendOtpMail(email, otp);
      res.json({ message: "success" });
    } else {
      res.status(200).json({ message: "Your email is already registered" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const value = myCache.get("myOtp");
    console.log(value, "thisi is myotp");
    const otp = req.body.otp;
    const password = req.body.password;

    if (otp === value) {
      const newpassword = await securePassword(password);

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: newpassword,
      });

      const userEmail = await User.findOne({ email: req.body.email });

      if (!userEmail) {
        const userData = await user.save();
        if (userData) {
          res.json({ message: "success" });
        } else {
          res.json({ message: "Your registration has failed" });
        }
      } else {
        res.json({ message: "Entered email is already registered" });
      }
    } else {
      res.json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const tocken = generateUserToken(user);
        res.status(201).json({ tocken: tocken, userData: user });
      } else {
        res.status(401).json({ message: "Invalid Email or Password" });
      }
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const listCity = async (req, res) => {
  try {
    const cityData = await Service.find();
    if (cityData) {
      res.json(cityData);
    } else {
      res.status(404).json({ message: "No cities found" });
    }
  } catch (error) {
    console.error("Error listing cities:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const profile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = await User.findOne({ _id: userId });
    if (userData) {
      res.json(userData);
    } else {
      res.status(404).json({ message: "No user data found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
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

const profileEdit = async (req, res) => {
  try {
    const userId = req.params.userId;
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;

    const updatedUserData = await User.findByIdAndUpdate(
      userId,
      {
        name: name,
        email: email,
        mobile: mobile,
      },
      { new: true }
    );
    if (updatedUserData) {
      res.status(200).json({ message: "User updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendForgotOtp = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "plantorium1@gmail.com",
        pass: "lhfkxofxdfyhflkq",
      },
    });
    const mailOptions = {
      from: "plantorium1@gamil.com",
      to: email,
      subject: "your otp verification code",
      html: "<p> Your Rest Password " + otp + " </p>",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent :-", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const forgetPassword = async (req, res) => {
  const email = req.body.resetEmail;
  myCache.set("myEmail", email, 900000);
  const otp = generateOtp();

  try {
    const ExistingEmail = await User.findOne({ email: email });

    if (ExistingEmail) {
      sendForgotOtp(email, otp);
      res.json({ message: "success" });
    } else {
      res.status(200).json({ message: "Your email is already registered" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyforgotOtp = async (req, res) => {
  const value = myCache.get("myOtp");
  const otpValue = req.body.otpValue;

  try {
    if (otpValue === value) {
      res.json("success");
    } else {
      res.json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const newPassword = req.body.password;
  const email = myCache.get("myEmail");

  try {
    const userData = await User.findOne({ email: email });
    if (userData) {
      const updatedData = await User.findOneAndUpdate(
        { email: email },
        { $set: { password: newPassword } },
        { new: true }
      );

      if (updatedData) {
        res.json({ success: true, message: "Password updated successfully" });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Password update failed" });
      }
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const vehicleDetail = async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;
    const vehicleData = await Vehicle.findOne({ _id: vehicleId });
    if (vehicleData) {
      res.json(vehicleData);
    } else {
      res.json({ message: "No vehicle data is found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const couponData = async (req, res) => {
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
};

const handleBooking = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = await User.findOne({ _id: userId });
    const city = req.body.city;
    const pickupPoint = req.body.pickupPoint;
    const dropPoint = req.body.dropPoint;
    const partnerData = await Partner.find({
      is_verified: true,
    });
    const length = partnerData.length;
    const pick = Math.floor(Math.random() * length);
    const partner = partnerData[pick];
    console.log(partner,"thisi site");
    if (partner) {
      io.to(partner.email).emit("new_request", {
        userData,
        city,
        pickupPoint,
        dropPoint,
      });
      res.json(partner);
    } else {
      res.status(404).json({ message: "No partner is found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


function generateBookingId() {
  let bookingId = "";
  for (let i = 0; i <8 ; i++) {
    bookingId += Math.floor(Math.random() * 10);
  }
  // myCache.set("myOtp", otp, 60000);
  return bookingId;
}

const bookingCompletion = async (req, res) => {

  try {
    const {
      userData,
      partnerData,
      pickupPoint,
      dropPoint,
      totalPrice,
      name,
      number,
    } = req.body;

 const bookId = generateBookingId()

    const Order = new Booking({
      userId: userData._id,
      booking_id:bookId,
      partnerId: partnerData._id,
      pickUpPoint: pickupPoint,
      dropPoint: dropPoint,
      totalPrice: totalPrice,
      booker_name: name,
      booker_Mobile: number,
    });
    const newOrder = await Order.save();

    const partnerUpdate = await Partner.findOneAndUpdate(
      { _id: partnerData._id },
      { $set: { currentBookingId: newOrder._id } }, 
      { new: true }
    );
    
    const bookingUpdate = new BookingHistory({
      debited:userData._id,
      credited:partnerData._id,
      amount:totalPrice,
      status:"booked"
    })
    const result = await bookingUpdate.save()

    if(newOrder){
      res.json({message:"success"})
    }

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error " });
  }
};


const detailsBooking = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookingData = await Booking.findOne({ userId: userId });
    if (bookingData) {
      res.json(bookingData);
    } else {
      res.status(404).json({ message: "ther is no booking data found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    
    const updatedBookingData = await Booking.findOneAndUpdate(
      { _id: bookingId },
      { is_canceled: true,status: "Canceled"  },
      { new: true }
    );

    const bookingUpdate = new BookingHistory({
      debited:partnerData._id,
      credited:userData._id,
      amount:totalPrice,
      status:"canceled"
    })

    const result = await bookingUpdate.save()

    const userId =updatedBookingData.userId
    const userWallet = await User.findOne({_id:userId})
    userWallet.wallet+=updatedBookingData.totalPrice
    
    await userWallet.save()
    console.log(userWallet,"thsi is the userwallwt");

  
    if (updatedBookingData) {
      res.json(updatedBookingData);
    } else {
      res
        .status(404)
        .json({ message: "ther is no updated booking data found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const bookingData = async (req,res)=>{
  try {
    const bookingId = req.params.id
    const bookingData = await Booking.findOne({_id:bookingId})

    if (bookingData) {
      console.log(bookingData, "this is the details");
      res.json(bookingData); 
    } else {
      res.status(404).json({ message: "No booking data found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const applyCoupon = async(req,res)=>{
      try {
        const code = req.body.code
        const price = req.body.price
        
        const totalPrice = Math.floor(price - (price * details.discount) / 100);
        if(totalPrice){
          res.json(totalPrice)
        }
        else{
          res.status(404).json({ message: "No data found" });
        }

      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
}

export default {
  userRegister,
  verifyOtp,
  userLogin,
  listCity,
  profile,
  profileEdit,
  vehicleList,
  forgetPassword,
  verifyforgotOtp,
  resetPassword,
  vehicleDetail,
  couponData,
  handleBooking,
  bookingCompletion,
  detailsBooking,
  cancelBooking,
  bookingData,
  applyCoupon
};
