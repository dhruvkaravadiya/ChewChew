const Joi = require('joi');

// Define Joi schema for the delivery man properties
const deliveryManValidationSchema = Joi.object({
      user_id: Joi.string().required().messages({
            'any.required': 'User Id of Delivery Man is Required',
      }),
      phoneNumber: Joi.string().min(10).required().messages({
            'any.required': 'Please enter Contact Number',
            'string.min': 'Contact Number must be at least 10 characters long',
      }),
      currentLocation: Joi.object({
            latitude: Joi.number(),
            longitude: Joi.number(),
      }),
      currentOrders: Joi.array().items(Joi.object({
            orderId: Joi.string().required(),
            orderStatus: Joi.string(),
            assignedTime: Joi.date(),
            restaurant: Joi.object({
                  id: Joi.string(),
                  name: Joi.string(),
            }),
            deliveryLocation: Joi.object({
                  latitude: Joi.number(),
                  longitude: Joi.number(),
            }),
      })),
      deliveryHistory: Joi.array().items(Joi.string()),
      earnings: Joi.number().default(0),
}).unknown(true);

function validateDeliveryMan(deliveryMan) {
      return Joi.validate(deliveryMan, deliveryManValidationSchema);
}

module.exports = { validateDeliveryMan };
