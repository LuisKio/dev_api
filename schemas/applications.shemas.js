const Joi = require('joi');

const addApplicationSchema = Joi.object({
  user_id: Joi.string().uuid(),
  legal_first_names: Joi.string().required(),
  legal_last_names: Joi.string().required(),
  nationality: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  date_of_birth: Joi.date().required(),
  gender: Joi.string().required(),
  passport_number: Joi.string().required(),
  passport_expiration_date: Joi.string().required(),
  residence: Joi.string().required(),
  residence_address: Joi.string().required(),
  job: Joi.string().required(),
  comments: Joi.string().required(),
});

const updateApplicationSchema = Joi.object({
  user_id: Joi.string().uuid(),
  legal_first_names: Joi.string(),
  legal_last_names: Joi.string(),
  nationality: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  date_of_birth: Joi.date(),
  gender: Joi.string(),
  passport_number: Joi.string(),
  passport_expiration_date: Joi.string(),
  residence: Joi.string(),
  residence_address: Joi.string(),
  job: Joi.string(),
  comments: Joi.string(),
  status: Joi.string().valid('draft', 'confirmed')
});

module.exports = {
  addApplicationSchema,
  updateApplicationSchema
};