import Joi from "joi";

const indexValidation = {
    addIndexValidationSchema: Joi.object({
        date: Joi.date().required(),
        value: Joi.number().required()
    }),
    
    deleteIndexValidationSchema: Joi.object({
        date: Joi.date().required()
    }),

    updateIndexValidationSchema: Joi.object({
        date: Joi.date().required(),
        value: Joi.number().required()
    })
};

export default indexValidation;