import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import partnerRoute from "./routes/partnerRoute.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cloudinary from "cloudinary";
import { Server } from "socket.io";
import { hello } from "./controller/userController.js";
import { hy } from "./controller/partnerController.js";
import User from "./model/userModel.js";
import Partner from "./model/partnerModel.js";
import messageModel from "./model/messageModel.js";
import { Types } from "mongoose";

const ObjectId = Types.ObjectId;

cloudinary.v2.config({
  cloud_name: "dvaxt1kn8",
  api_key: "384571447232285",
  api_secret: "WNMGc_GnTieJ9kwL6Iqh36kWyTQ",
});

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

const server = app.listen(port, () => {
  console.log(`server start at port no.${port}`);
});

// const server = http.createServer(app);

/// socket io///

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (email) => {
    socket.join(email);
    console.log(`joined the room ${email}`);
  });

  socket.on("join", (email) => {
    socket.join(email);
    console.log(`joinde the user room${email}`);
  });

  socket.on("request_accepted", (data) => {
    socket.emit("from_partner", { data });
  });

  socket.on("acceptBooking", (data) => {});
});

hello(io);
hy(io);

app.use("/admin", adminRoute);
app.use("/partner", partnerRoute);
app.use("/", userRoute);

io.on("connection", (socket) => {
  socket.on("listMessages", async (data) => {
    console.log(data,"this is the messages");
    try {
      const { bookingId } = data;
      console.log(bookingId,"this is the bookingid");
      // Retrieve messages from MongoDB
      const messages = await messageModel.findOne({ bookingId: bookingId })
      console.log(messages,"this is the messages>>>>>>>>>>>>34567890....................");
      // Emit the messages to the client
      socket.emit("messageList", messages);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("addMessage", async (data) => {
    try {
      const currentDate = new Date();
      const currentFormattedTime = currentDate.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });


      const { bookingId, userId, partnerId, message, currentUserId } = data;
      const messageExist = await messageModel.findOne({ bookingId: bookingId });

      const user = await User.findOne({ _id: currentUserId });
      if (user) {
        var userName = user.name;
      }

      const partner = await Partner.findOne({ _id: currentUserId });
      if (partner) {
        var userName = partner.name;
      }

      // if (messageExist) {
      const newMessage = {
        text: message,
        sender: currentUserId,
        userName: userName,
        time:currentFormattedTime
      };

      const updateResult = await messageModel.updateOne(
        { bookingId: bookingId },
        {
          $push: {
            messages: newMessage,
          },
        },
        { upsert: true, new: true }
      );
      io.emit("messageAdded");
    } catch (err) {
      console.error(err);
    }
  });
});

connectDB();
