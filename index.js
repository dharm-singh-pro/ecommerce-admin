const supertokens = require('supertokens-node');
const Session = require('supertokens-node/recipe/session');
const EmailPassword = require('supertokens-node/recipe/emailpassword');
const Dashboard = require('supertokens-node/recipe/dashboard');
const AccountLinking = require('supertokens-node/recipe/accountlinking');


supertokens.init({
    framework: 'express',
    supertokens: {
       /* https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.*/
        connectionURI: 'http://localhost:3567/',
        // apiKey: <API_KEY(if configured)>,
    },
    appInfo: {
        /*learn more about this on https://supertokens.com/docs/session/appinfo*/
        appName: 'Fontend app',
        apiDomain: 'http://localhost:8080',
        websiteDomain: 'http://localhost:3000',
        // apiBasePath: '/auth',
        apiBasePath: '/api/auth',
        websiteBasePath: '/',
    },
    recipeList: [
        EmailPassword.init({
          signUpFeature: {
            formFields: [{
              id: "name"
            }, {
              id: "age"
            }, {
              id: "country",
              optional: true
            }]
          }
        }), /*initializes signin / sign up features*/
        Session.init({
            exposeAccessTokenToFrontendInCookieBasedAuth: true,
        }), /*initializes session features*/
        Dashboard.init(),
    ]
})

require('./src/app.js');