import Partner from "../model/partnerModel.js";
import Vehicle from "../model/vehicleModel.js"
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import NodeCache from "node-cache";
import cloudinary from "cloudinary";

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
  console.log("inside the partner register");
  try {
    const email = req.body.email;
    const otp = generateOtp();

    const partnerExist = await Partner.findOne({ email: req.body.email });

    if (!partnerExist) {
      console.log("inside partner not exist");
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
    const Inurance = await cloudinary.v2.uploader.upload( req.body.insuranceFile);
    const Rc = await cloudinary.v2.uploader.upload(req.body.rcFile);


    if (otp === value) {
      console.log("inside the if condition");
      const newpassword = await securePassword(password);

      const partner = new Partner({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: newpassword,
        aadhar: Aadhar.url,
        liscense: Liscense.url,
        insurance: Inurance.url,
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

    const partnerData = await Partner.findOne({ email:email});
    const passwordMatch = await bcrypt.compare(password,partnerData.password);

    if (passwordMatch) {
      res.status(201).json({ message: "success" });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const vehicleList = async(req,res)=>{
  console.log("inside the vehicle List");
      try {
        const vehicleData = await Vehicle.find()
        if(vehicleData){
          res.json(vehicleData)
        }
        else{
          res.status(404).json({ message: "No vehicle data found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
}

export default {
  partnerRegister,
  verifyOtp,
  partnerLogin,
  vehicleList
};
