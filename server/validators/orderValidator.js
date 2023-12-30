const Joi = require('joi');

function validateOrder (order)  {
      const orderValidationSchema = Joi.object({
            customer: Joi.object({
                  id: Joi.string().required().messages({
                        'any.required': 'Customer ID is required.',
                  }),
                  name: Joi.string().required().messages({
                        'any.required': 'Customer name is required.',
                  }),
            }),
            restaurant: Joi.object({
                  id: Joi.string().required().messages({
                        'any.required': 'Restaurant ID is required.',
                  }),
                  name: Joi.string().required().messages({
                        'any.required': 'Restaurant name is required.',
                  }),
            }),
            deliveryLocation: Joi.object({
                  latitude: Joi.number().required().messages({
                        'any.required': 'Latitude is required.',
                  }),
                  longitude: Joi.number().required().messages({
                        'any.required': 'Longitude is required.',
                  }),
            }),
            items: Joi.array().items(
                  Joi.object({
                        foodId: Joi.string().required().messages({
                              'any.required': 'Food ID is required.',
                        }),
                        foodName: Joi.string().required().messages({
                              'any.required': 'Food name is required.',
                        }),
                        foodPrice: Joi.number().required().messages({
                              'any.required': 'Food price is required.',
                        }),
                        count: Joi.number().required().messages({
                              'any.required': 'Count is required.',
                        }),
                  })
            ),
            orderTotal: Joi.number().required().messages({
                  'any.required': 'Order total is required.',
            }),
            payment: Joi.object({
                  sessionId: Joi.string(),
            }),
            paymentStatus: Joi.string().valid('Pending', 'Paid', 'Failed').default('Pending'),
            orderStatus: Joi.string().valid('Placed', 'Prepared', 'Preparing', 'Picked', 'Completed', 'Canceled').default('Placed'),
            placedAt: Joi.date().default(() => new Date(), 'current date'),
            OTP: Joi.number().messages({
                  'number.base': 'OTP must be a number.',
            }),
            OTPExpiry: Joi.date().messages({
                  'date.base': 'Invalid date format for OTP expiry.',
            }),
      }).unknown(true);
      return Joi.validate(order , orderValidationSchema);
}

exports.validate = validateOrder;