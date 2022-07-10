const Hapi = require('@hapi/hapi');
const Ejs = require('ejs');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Path = require('path');
const Mongoose = require('mongoose');
const userModel = require('./database/user');
const userSchema = require('./utils/userSchema');
const Joi = require('@hapi/joi');



const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });

    server.log(['test', 'error'], 'Test event');

    await server.register(Vision);
    await server.register(Inert);

    server.views({
        engines: { ejs: Ejs },
        relativeTo: __dirname,
        path: 'templates'
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.view('signup', { error: false });
        }
    });

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: Path.join(__dirname, 'public')
            }
        }
    })

    server.route({
        method: 'GET',
        path: '/login',
        handler: (request, h) => {
            return h.view('login');
        }
    })

    server.route({
        method: 'POST',
        path: '/',
        handler: async (request, h) => {
            var error, message;
            const result = await userModel.findOne({ emailId: request.payload.email.toLowerCase() })
            if(result) {
                message = 'Email Already Exists';
            }
            else {
                try {
                    const result = await userSchema.validateAsync(request.payload);
                    // console.log(result);
                    userModel.create({
                        name: request.payload.username,
                        emailId: request.payload.email.toLowerCase(),
                        pass: request.payload.password,
                        isVerified: false
                    });
                }
                catch(err) {
                    errMsg = err.details[0].message;
                    errType = err.details[0].type;

                    if(errMsg == '"email" must be a valid email')
                        message = 'Not a valid email';
                    else if(errType == 'string.min')
                        message = `Password should be at least ${err.details[0].context.limit} characters long`;
                    else if(errType == 'string.max')
                        message = `Password should not exceed ${err.details[0].context.limit} characters`;
                    else if(errType == 'string.pattern.base') 
                        message = 'Password should be alphanumeric only';
                    else if(errMsg == '"confirm" must be [ref:password]')
                        message = 'Password does not match';
                }   
            }
            return h.view('signup', { error: message });
        }
    })

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

init();

module.exports = init;