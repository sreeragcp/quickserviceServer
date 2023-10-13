import Admin from "../model/adminModel.js";
import User from "../model/userModel.js";
import Partner from "../model/partnerModel.js";
import Service from "../model/serviceModel.js";
import Vehicle from "../model/vehicleModel.js";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

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

    const vehicleExist = await Vehicle.findOne({ vehicle: vehicle });

    if (vehicleExist) {
      return res.status(400).json({ error: "Vehicle already exists" });
    }

    const vehicleData = new Vehicle({
      vehicle: vehicle,
      Image: Image.url,
      minWeight: minWeight,
      maxWeight: maxWeight,
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

export default {
  adminLogin,
  addCity,
  listCity,
  userList,
  partnersList,
  vehicle,
  vehicleList,
};
