const validateRequest = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req.body, {
        abortEarly: false, stripUnknown: true
    });

    // stripUnknown: true => Removes unwanted fields automatically
    // abortEarly: false => Returns ALL errors, not stop at first error

    if (error) {
        return res.status(400).json({
            success: false,
            errors: error.details.map(e => ({
                field: e.path.join("."),
                message: e.message
            }))
        })
    }

    req.body = value;
    next();
};
module.exports = validateRequest

