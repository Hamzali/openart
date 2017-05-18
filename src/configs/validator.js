const expressValidator = require('express-validator');

module.exports = app => {
    app.use(
        expressValidator({
            customValidators: {
                isArray: (value) => {
                    return Array.isArray(value);
                },

                isString: (value) => {
                    return typeof value === typeof 'string';
                }
            }   
        })
    );

    return this;
};