const Joi = require('joi');

// Define Joi schema for the customer properties
const customerValidationSchema = Joi.object({
      user_id: Joi.string().required().messages({
            'any.required': 'User Not Registered',
      }),
      currentOrders: Joi.array().items(Joi.string()),
      pastOrders: Joi.array().items(Joi.string()),
      location: Joi.object({
            latitude: Joi.string(),
            longitude: Joi.string(),
      }),
}).unknown(true);

function validateCustomer(customer) {
      return Joi.validate(customer, customerValidationSchema);
}

module.exports = { validateCustomer };
