const Customer = require('../models/Customer');
const { getcoordinates } = require("../helpers/utils/getCoordinates");
const User = require("../models/User");
async function createCustomer(req, res) {
      const coordinates = await getcoordinates();
      const customer = new Customer({
            user_id: req.user.id,
            location: {
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude
            }
      });
      await User.findByIdAndUpdate({ _id: req.user.id }, { $set: { role: 'Customer' } });
      await customer.save();
      return res.status(201).json({ success: true, message : "New Customer Created" , customer: customer },);
}

async function updateCustomerDetails(req, res) {
      const updatedCustomer = await Customer.findOneAndUpdate(
            { user_id: req.user.id },
            { $set: req.body },
            { new: true }
      );
      if (!updatedCustomer) {
            return res.status(404).json({success : false, error : "Customer not found"});
      }
      res.status(202).json({ success: true, message: "Customer Update Successfully", updatedCustomer : updatedCustomer });
}

async function deleteCustomer(req, res) {
      const deletedCustomer = await Customer.findOneAndDelete({ user_id: req.user.id });
      if (!deletedCustomer) {
            return res.status(404).json({success : false, error: "Customer not found" });
      }
      return res.status(200).json({ success: true, customer: deletedCustomer });
}

module.exports = { createCustomer, updateCustomerDetails, deleteCustomer }