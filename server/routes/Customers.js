const express = require("express");
const router = express.Router();
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const isLoggedIn = require("../middlewares/isLoggedIn");
const customerController = require("../controllers/customerController");

// # new customer
router.post('/create', isLoggedIn ,asyncErrorHandler(customerController.createCustomer));
// # update customer
router.put('/update', isLoggedIn, verifyRole("Customer"), asyncErrorHandler(customerController.updateCustomerDetails));
// # delete customer
router.delete('/delete', isLoggedIn, verifyRole("Customer"), asyncErrorHandler(customerController.deleteCustomer));

module.exports = router;