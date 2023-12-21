const express = require("express");
const app = express();
const cookieparser = require('cookie-parser');
const cors = require("cors");
const http = require("http");

module.exports = function middlewares(req, res, next) {
      // Body Parser Middleware to parse data from the body to JSON
      app.use(express.json());

      // Middleware to parse URL-encoded data
      app.use(express.urlencoded({ extended: true }));

      // Enable cross-origin resource sharing using cors() middleware
      app.use(cors(
            {
                  origin: LOCALHOST_ORIGIN,
                  credentials: true,
                  methods: "GET,POST",
            }
      ));
      // Cookie-parser middleware to parse data from Cookie
      app.use(cookieparser());

      // Configure the file upload
      app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/'
      }));

      // set real ip proxy trust settings
      app.set('trust proxy', true);
}