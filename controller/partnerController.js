import Partner from "../model/partnerModel.js";
import Vehicle from "../model/vehicleModel.js";
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import NodeCache from "node-cache";
import cloudinary from "cloudinary";
import Booking from "../model/bookingModel.js";
import Admin from "../model/adminModel.js";
import BookingHistory from "../model/bookingHistoryModel.js";
import { generatePartnerToken } from "../utils/generateUserToken.js";
let io;

export const hy = async (i) => {
  io = i;
};

const myCache = new NodeCache();

function generateOtp() {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  myCache.set("myOtp", otp, 90000);
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

const partnerRegister = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = generateOtp();
    console.log(otp, "this is the partner otp");
    const partnerExist = await Partner.findOne({ email: req.body.email });

    if (!partnerExist) {
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
    const otp = req.body.otp;
    const password = req.body.password;

    const Aadhar = await cloudinary.v2.uploader.upload(req.body.aadharFile);
    const Liscense = await cloudinary.v2.uploader.upload(req.body.licenseFile);
    const Inurance = await cloudinary.v2.uploader.upload(
      req.body.insuranceFile
    );
    const Rc = await cloudinary.v2.uploader.upload(req.body.rcFile);

    if (otp === value) {
      const newpassword = await securePassword(password);

      const partner = new Partner({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: newpassword,
        aadhar: Aadhar.url,
        liscense: Liscense.url,
        insurance: Inurance,
        rcFile: Rc.url,
        vehicle: req.body.vehicle,
        state: req.body.state,
        city: req.body.city,
        pin: req.body.pin,
      });

      const partnerEmail = await Partner.findOne({ email: req.body.email });

      if (!partnerEmail) {
        const partnerData = await partner.save();
        if (partnerData) {
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
    console.log(error.message);
  }
};

const partnerLogin = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;
    const partnerData = await Partner.findOne({ email: email });
    const passwordMatch = await bcrypt.compare(password, partnerData.password);
    const tocken = generatePartnerToken(partnerData)
    if (passwordMatch) {
      res.status(201).json({ message: "success", partnerData: partnerData, tocken: tocken });

    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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

const partnerEdit = async (req, res) => {
  try {
    const partnerId = req.params.partnerId;
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;

    const updatedPartnerData = await Partner.findByIdAndUpdate(
      partnerId,
      {
        name: name,
        email: email,
        mobile: mobile,
      },
      { new: true }
    );

    if (updatedPartnerData) {
      res.status(200).json({
        message: "User updated successfully",
        data: updatedPartnerData,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const partnerData = async (req, res) => {
  try {
    const partnerId = req.params.partnerId;
    const partnerData = await Partner.findById({ _id: partnerId });
    if (partnerData) {
      res.json(partnerData);
    } else {
      res.status(404).json({ message: "No partner data found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    io.to(user.email).emit("acceptBooking", { message: "success" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    io.to(user.email).emit("rejectBooking", { message: "reject" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const bookingDetails = async (req, res) => {
  try {
    const partnerId = req.params.partnerId;
    const partnerDetails = await Booking.findOne({ partnerId: partnerId });
    if (partnerDetails) {
      res.json(partnerDetails);
    } else {
      res.json({ message: "there is no partnerDetails" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateBooking = async (req, res) => {
  console.log("inside the update booking");
  try {
    const partnerId = req.params.partnerId;
    const status = req.body.status;
    const partnerData = await Partner.findOne({ _id: partnerId });
    const bookingId = partnerData.currentBookingId;
    const updatedBookingData = await Booking.findOneAndUpdate(
      { _id: bookingId },
      { $set: { status: status } },
      { new: true }
    );

    if (updatedBookingData) {
      res.status(200).json({
        message: "Booking updated successfully",
        data: updatedBookingData.status,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendOrderOtpMail = async (email, otp) => {
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
        "<p> Your Quick_Service Deliver confirmation one time password is  " +
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

const generateOrderOtp = async (req, res) => {
  try {
    const partnerId = req.params.partnerId;
    const partnerData = await Partner.findOne({ _id: partnerId });
    const BookingId = partnerData.currentBookingId;
    const bookingData = await Booking.findOne({ _id: BookingId });
    const email = bookingData.booker_email
    const otpValue = generateOtp();
    if (email) {
      sendOrderOtpMail(email,otpValue);
      res.json({ message: "success" });
    } else {
      res.status(200).json({ message: "User is not exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyPartnerOtp = async (req, res) => {
  try {
    const partnerId = req.params.partnerId;
    const value = myCache.get("myOtp");
    const otp = req.body.otpValue;
    const status = "Delivered";

    const bookingData = await Partner.findOne({ _id: partnerId });
    const bookingId = bookingData.currentBookingId;

    if (otp === value) {
      const bookingdata = await findOne({ _id: bookingId });
      const totalPrice = bookingData.totalPrice;
      const adminEmail = "sreeragkunnothuparamba@gamil.com";
      const adminAmount = (totalPrice * 10) / 100;
      const partnerAmount = (totalPrice * 90) / 100;
      const updatedBookingData = await Booking.findOneAndUpdate(
        { _id: bookingId },
        { $set: { status: status } },
        { new: true }
      );
      if (updatedBookingData) {
        const updataAdmin = await Admin.findOneAndUpdate(
          { email: adminEmail },
          { $set: { wallet: adminAmount } },
          { new: true }
        );

        const partnerId = updatedBookingData.partnerId;
        const partnerWallet = await Partner.findOne({ _id: partnerId });
        partnerWallet.wallet += partnerAmount;

        await partnerWallet.save();

        await Partner.findOneAndUpdate(
          { _id: partnerId },
          { $set: { currentBookingId: null } }
        );

        console.log(partnerWallet, "thsi is the partnerWallet")

        res.json({ message: "success" });
      }
    } else {
      res.json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const currentBookingData = async (req, res) => {
  console.log("inside the current");
  const partnerId = req.params.partnerId;
  console.log(partnerId,"this is the ");
  try {
    const partnerData = await Partner.findOne({ _id: partnerId });
    const bookingId = partnerData.currentBookingId;
    const bookingData = await Booking.findOne({ _id: bookingId });
    if (bookingData) {
      res.json(bookingData);
    } else {
      res.status(200).json({ message: "ther is no current booking data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getGraph = async (req, res) => {
  const currentdate = new Date();
  try {
    const data = await BookingHistory.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day"
                }
              }
            }
          },
          totalAmount: 1
        }
      }
    ]);

    const bookings = await BookingHistory.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          totalcount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day"
                }
              }
            }
          },
          totalcount: 1
        }
      }
    ]);
    if(data){
      res.json({data,bookings})
    }

  } catch (error) {}
};
 
const getUserData = async(req,res)=>{
  try {
    const userId = req.params.userId
    console.log(userId,"this is the userId");
    const data = await User.findOne({_id:userId})
    if(data){
      res.json(data)
    }
    else{
      res.status(200).json({ message: "ther is no user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export default {
  partnerRegister,
  verifyOtp,
  partnerLogin,
  vehicleList,
  partnerEdit,
  partnerData,
  acceptBooking,
  rejectBooking,
  bookingDetails,
  updateBooking,
  generateOrderOtp,
  verifyPartnerOtp,
  currentBookingData,
  getGraph,
  getUserData
};
