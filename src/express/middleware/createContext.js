// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/src/express/middleware/createContext
@description Creates middleware that initializes the request.azureMobile
property.
*/
var data = require('../../data'),
    attachOperators = require('../../query/attachOperators'),
    logger = require('../../logger');

/**
Create a new instance of the createContext middleware
@param {configuration} configuration The mobile app configuration
*/
module.exports = function (configuration) {
    var dataProvider = data(configuration);

    return function (req, res, next) {
        var context = req.azureMobile = {
            req: req,
            res: res,
            data: dataProvider,
            configuration: configuration,
            logger: logger,
            tables: function (name) {
                if(!configuration.tables[name])
                    throw new Error("The table '" + name + "' does not exist.")
                return attachOperators(name, dataProvider(configuration.tables[name], context));
            }
        };
        next();
    };
};
