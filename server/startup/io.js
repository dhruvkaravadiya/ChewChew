const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", (socket) => {
      console.log("A user connected");

      // broadcast on login
      socket.on("userLogin", (loginMessage) => {
            io.emit("userLogin", loginMessage);
            console.log("User logged in");
      });

      // broadcast on successful order place
      socket.on("orderPlaced", (data)=>{
            io.emit("orderPlaced", data);
            console.log("Order placed successfully");
      });

      // broadcast update status
      socket.on("orderStatusUpdate", (data) => {
            io.emit("updateOrderStatus", data);
            console.log("Order status updated");
      });

      // broadcast on disconnnect
      socket.on("disconnect", () => {
            io.emit("A user disconnected");
            console.log("A user disconnected");
      });
});

module.exports = { io, app, server, express };