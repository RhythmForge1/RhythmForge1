const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const baseSchema = {
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        projectCode: Joi.string().min(4).max(100).required(),
        userType: Joi.string().valid('Internal', 'Vendor').required(),
        accessType: Joi.string().min(3).max(10).required(),
        role: Joi.string().min(3).max(20).required(),
        lineManagerEmail: Joi.string().email().required(), // Required for all users
    };

    const internalSchema = {
        sapId: Joi.string().min(3).max(10).required(), // Required for Internal
        businessJustification: Joi.string().min(3).max(50).required(), // Required for Internal
    };

    // Extend base schema based on userType
    const schema = Joi.object(
        req.body.userType === 'Internal'
            ? { ...baseSchema, ...internalSchema } // Include Internal-specific fields
            : baseSchema // Vendor does not require sapId or businessJustification
    );

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Bad request', error });
    }
    next();
};

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        projectCode: Joi.string().min(4).max(100).required(),
        userType: Joi.string().valid('Internal', 'Vendor').required(),
    }).unknown(false);
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Bad request', error });
    }
    next();
};

module.exports = {
    signupValidation,
    loginValidation,
};
