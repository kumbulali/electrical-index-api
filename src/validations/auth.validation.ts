import Joi from "joi";

const authValidation = {
    loginValidationSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    
    registerValidationSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        verifyPassword: Joi.ref('password'),
        company: Joi.string().required()
    }),

    changePasswordValidationSchema: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
        newPasswordVerify: Joi.ref('newPassword')
    })
};

export default authValidation;