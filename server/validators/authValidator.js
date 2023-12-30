const Joi = require('joi');

const validateUser = (data) => {
      const schema = Joi.object({
            name: Joi.string().min(5).max(50),
            email: Joi.string().email(),
            password: Joi.string().min(8),
            role: Joi.string().valid('Customer', 'Restaurant', 'DeliveryMan'),
      });

      const { error } = schema.validate(data, {
            abortEarly: false,
            messages: {
                  'string.min': '{#label} should be at least {#limit} characters',
                  'string.max': '{#label} should be at most {#limit} characters',
                  'string.email': 'Invalid email address',
                  'any.only': 'Invalid {#label}',
            },
      });

      return error;
};

module.exports = {
      validateUser,
};
