/*
* creat an export configuration variable
*
*/

// container for all the environments
var environments = {};

// staging (default)
environments.staging = {
    'httpPort': 4000,
    'httpsPort': 4001,
    'envName': 'staging'
}

// production
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'
}

// current environment cli
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// environment to export
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// export the module
module.exports = environmentToExport;