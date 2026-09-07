const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const { LOCALHOST_ORIGIN } = require("../config/appConfig");

const allowedOrigins = [
    LOCALHOST_ORIGIN,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
].filter(Boolean);

const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Each user joins their own room identified by their userId
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room: ${roomId}`);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

module.exports = { io, app, server, express };