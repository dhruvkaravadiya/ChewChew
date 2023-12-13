const Customer = require('../models/Customer');
const { getCordinates } = require("../helpers/utils/getCordinates");
const User = require("../models/User");
async function createCustomer(req, res) {
      const cordinates = await getCordinates();
      const customer = new Customer({
            user_id: req.user.id,
            location: {
                  latitude: cordinates.latitude,
                  longitude: cordinates.longitude
            }
      });
      await User.findByIdAndUpdate({ _id: req.user.id }, { $set: { role: 'Customer' } });
      await customer.save();
      return res.status(200).json({ "success": true, "customer": customer },);
}

async function updateCustomerDetails(req, res) {
      const updatedCustomer = await Customer.findOneAndUpdate(
            { user_id: req.user.id },
            { $set: req.body },
            { new: true }
      );
      if (!updatedCustomer) {
            return res.status(404).send("Customer not found");
      }
      res.status(200).json({ "success": true, "message": "Customer Update Successfully" });
}

async function deleteCustomer(req, res) {
      const deletedCustomer = await Customer.findOneAndDelete({ user_id: req.user.id });
      if (!deletedCustomer) {
            return res.status(404).json({ "error": "Customer not found" });
      }
      return res.status(204).json({ "success": true, "customer": deletedCustomer });
}

module.exports = { createCustomer, updateCustomerDetails, deleteCustomer }