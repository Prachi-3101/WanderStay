const Joi = require('joi');

const allowedCategories = [
  'anywhere',
  'amazing-pools',
  'beachfront',
  'cabins',
  'treehouses',
  'iconic-cities',
  'mountains',
  'skiing',
  'lakefront',
  'omg'
];

module.exports.listingSchema = listingSchema = Joi.object({
     listing : Joi.object({
        title:Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("",null),
        category: Joi.string().valid(...allowedCategories).default('anywhere')
     }).required()
});

module.exports.reviewSchema = Joi.object({
   review: Joi.object({
     rating: Joi.number().min(1).max(5).optional(),
      comment: Joi.string().required(),
   }).required()
});
   