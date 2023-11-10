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
import {hello} from "./controller/userController.js"
import { hy } from "./controller/partnerController.js"
import User from "./model/userModel.js";
import Partner from "./model/partnerModel.js";
import messageModel from "./model/messageModel.js";
import { Types } from 'mongoose';

const ObjectId = Types.ObjectId;

// const { ObjectId } = require("mongodb");

cloudinary.v2.config({
  cloud_name: "dvaxt1kn8",
  api_key: "384571447232285",
  api_secret: "WNMGc_GnTieJ9kwL6Iqh36kWyTQ",
});

dotenv.config();
const app = express();
const port = process.env.PORT;

//middleware
// app.use(bodyParser.json({ limit: "200mb" }));
// app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({limit:"500mb"}))
app.use(express.urlencoded({extended:true,limit:"500mb"}))
app.use(cors({origin:true,credentials:true}));
app.use(cookieParser());


 const server = app.listen(port, () => {
  console.log(`server start at port no.${port}`);
});

// const server = http.createServer(app);

/// socket io///

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
    socket.on('join_room',(email)=>{  
      socket.join(email)
      console.log(`joined the room ${email}`);
    })

    socket.on("join",(email)=>{
        socket.join(email)
        console.log(`joinde the user room${email}`);
    })
 
    socket.on("request_accepted",(data)=>{
        socket.emit("from_partner",{data})
    })

    socket.on("acceptBooking",(data)=>{
    })
});

hello(io)
hy(io)

app.use("/admin", adminRoute);
app.use("/partner", partnerRoute);
app.use("/", userRoute);



io.on("connection", (socket) => {
  socket.on("listMessages", async (data) => {
    try {
      const { bookingId } = data;
      // Retrieve messages from MongoDB
      const messages = await messageModel.findOne({ bookingId: bookingId });

      // Emit the messages to the client
      socket.emit("messageList", messages);
    } catch (err) {
      console.error(err);
    }
  });
  socket.on("addMessage", async (data) => {
    try {
      const { bookingId, userId,partnerId, message, currentUserId } = data;
      const messageExist = await messageModel.findOne({ bookingId: bookingId });

      const user = await User.findOne({_id:currentUserId});
      if (user) {
        var userName = user.name;
      }

      const partner = await Partner.findOne({_id:currentUserId});
      if (partner) {
        var userName = partner.name;
      }

      if (messageExist) {
        const newMessage = {
          text: message,
          sender: currentUserId, 
          userName: userName,
        };

        const updateResult = await messageModel.updateOne(
          { bookingId: bookingId },
          {
            $push: {
              messages: newMessage,
            },
          }
        );
        // console.log(updateResult, "---------updateResult----------");
      } else {
        const newMessage = new messageModel({
          bookingId:new ObjectId(bookingId), // Replace with the actual Booking ID
          userId:new ObjectId(userId), // Replace with the actual User ID
          partnerId:new ObjectId(partnerId), // Replace with the actual Vendor ID
          // room:roomName,
          messages: [
            {
              text: message,
              sender: currentUserId, // Replace with the sender's ID
              userName: userName,
            },
            // Add more messages as needed
          ],
        });
        console.log(newMessage,"--new Message");

        newMessage
          .save()
          .then((savedMessage) => {
            console.log("Message saved:", savedMessage);
            // Handle the success case
          })
          .catch((error) => {
            console.error("Error saving message:", error);
            // Handle the error case
          });
      }
      // Emit the "messageAdded" event to all connected sockets
      io.emit("messageAdded");
    } catch (err) {
      console.error(err);
    }

  });
});

connectDB();

