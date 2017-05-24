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
                },

                isValidPassword: (value) => {
                    const minLength = 6;
                    const maxLength = 16;
                    const regularExpression  = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
                    
                    if (value.length < minLength || value.length > maxLength) {
                        return false;
                    }

                    if (!regularExpression.test(value)) {
                        return false;
                    }

                    return true;
                }
            }   
        })
    );

    return this;
};