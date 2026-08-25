const validate = (schema, property = "body") => (req, res, next) => {
    // console.log("VALIDATE BODY =>", req.body);
    // console.log("PROPERTY:", property);
    // console.log("DATA:", req[property]);
    const { value, error } = schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        return res.status(400).json({
            success: false,
            errors: error.details.map(e => ({
                field: e.path.join("."),
                message: e.message
            }))
        });
    }

    req[property] = value;
    next();
}

module.exports = validate;