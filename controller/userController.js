import User from "../model/userModel.js";
import Service from "../model/serviceModel.js";
import Vehicle from "../model/vehicleModel.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import NodeCache from "node-cache";
import generateTocken from "../utils/generateUserToken.js";

const myCache = new NodeCache();

// true

function generateOtp() {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  const success = myCache.set("myOtp", otp, 90000);
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
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const tocken = generateTocken(res, user._id);
      res.status(201).json({ tocken: tocken,userData:user});
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
    const userId = req.params.userId
    const userData = await User.findOne({_id:userId});
    if (userData) {
      res.json(userData);
    } else {
      res.status(404).json({ message: "No user data found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const vehicleList = async(req,res)=>{
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
}

export default {
  userRegister,
  verifyOtp,
  userLogin,
  listCity,
  profile,
  vehicleList
};
