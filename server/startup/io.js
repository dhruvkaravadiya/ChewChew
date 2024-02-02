const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const { LOCALHOST_ORIGIN } = require("../config/appConfig");

const io = socketIo(server, {
    cors: {
        origin: LOCALHOST_ORIGIN,
        credentials: true,
        methods: "GET,POST,DELETE,PUT",
    },
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        io.emit("A user disconnected");
        console.log("A user disconnected");
    });
});

module.exports = { io, app, server, express };
