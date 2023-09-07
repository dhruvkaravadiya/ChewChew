const app = require("./routers"); // Import the Express app
const { PORT } = require("../config/appConfig");

const server = app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});

module.exports = server;
