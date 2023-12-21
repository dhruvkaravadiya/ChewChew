const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("userLogin", (loginMessage) => {
            io.emit("userLogin", loginMessage);
            console.log("User logged in");
      });

      socket.on("orderStatusUpdate", (data) => {
            // Broadcast the order status update to all connected clients
            io.emit("updateOrderStatus", data);
            console.log("Order status updated");
      });

      socket.on("disconnect", () => {
            io.emit("A user disconnected");
            console.log("A user disconnected");
      });
});

module.exports = { io, app, server, express };