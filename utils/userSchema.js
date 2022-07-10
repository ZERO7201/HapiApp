const Joi = require('@hapi/joi');

const userSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email().lowercase().required(),

    password: Joi.string()
        .min(3)
        .max(30)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

    confirm: Joi.any().valid(Joi.ref('password')).required(),

    access_token: [
        Joi.string(),
        Joi.number()
    ]
})
    .with('password', 'confirm');


// schema.validate({ username: 'abc', birth_year: 1994 });
// // -> { value: { username: 'abc', birth_year: 1994 } }

// schema.validate({});
// // -> { value: {}, error: '"username" is required' }

// // Also -

// try {
//     const value = await schema.validateAsync({ username: 'abc', birth_year: 1994 });
// }
// catch (err) { }

module.exports = userSchema;