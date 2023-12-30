const Joi = require('joi');

// Define Joi schema for the restaurant properties
const restaurantValidationSchema = Joi.object({
      restaurantName: Joi.string().required().messages({
            'any.required': 'Please enter Restaurant Name',
      }),
      user_id: Joi.string().required().messages({
            'any.required': "Restaurant's Owner Id is required",
      }),
      phoneNumber: Joi.string().min(10).required().messages({
            'any.required': 'Please enter Contact Number',
            'string.min': 'Contact Number must be at least 10 characters long',
      }),
      quickDescription: Joi.string().min(10).max(30).required().messages({
            'any.required': 'Please enter Quick Description',
            'string.min': 'Quick Description must be at least 10 characters long',
            'string.max': 'Quick Description can be at most 30 characters long',
      }),
      address: Joi.string().required().messages({
            'any.required': 'Please enter the address',
      }),
      detailedDescription: Joi.string().min(100).max(400).required().messages({
            'any.required': 'Please enter Description',
            'string.min': 'Description must be at least 100 characters long',
            'string.max': 'Description can be at most 400 characters long',
      }),
      cuisines: Joi.array().items(Joi.string()),
      location: Joi.object({
            latitude: Joi.string(),
            longitude: Joi.string(),
      }),
      photo: Joi.object({
            id: Joi.string(),
            photoUrl: Joi.string(),
      }),
      totalRatings: Joi.number().default(0),
      avgRating: Joi.number().default(0).min(0).max(5),
      menu: Joi.array().items(Joi.string()), // Assuming Food model has string IDs
      openingHours: Joi.string().required().pattern(/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/).messages({
            'any.required': 'Opening Hours is required',
            'string.pattern.base': 'Invalid time format. Use HH:MM format.',
      }),
      closingHours: Joi.string().required().pattern(/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/).messages({
            'any.required': 'Closing Hours is required',
            'string.pattern.base': 'Invalid time format. Use HH:MM format.',
      }),
      deliveryCharges: Joi.number().required().messages({
            'any.required': 'Please add delivery charges',
      }),
      promotions: Joi.string(),
      income: Joi.number().default(0),
}).unknown(true);

function validateRestaurant (restaurant){
      return Joi.validate(restaurant , restaurantValidationSchema);
}
module.exports = { validateRestaurant }