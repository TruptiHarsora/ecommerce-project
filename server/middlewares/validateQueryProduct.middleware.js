const validateProductQuery = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details.map(e => e.message),
        });
    }

    req.query = value;
    next();
};

module.exports = validateProductQuery;

