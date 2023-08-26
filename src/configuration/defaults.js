// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var path = require('path'),
    environment = require('../utilities/environment'),
    packageJson = require('../../package.json');

module.exports = function () {
    return {
        platform: 'express',
        basePath: basePath(),
        configFile: 'azureMobile',
        promiseConstructor: Promise,
        apiRootPath: '/api',
        tableRootPath: '/tables',
        notificationRootPath: '/push/installations',
        authStubRoute: '/.auth/login/:provider',
        debug: environment.debug,
        version: 'node-' + packageJson.version,
        apiVersion: '2.0.0',
        homePage: false,
        maxTop: 1000,
        pageSize: 50,
        userIdColumn: 'userId',
        logging: {
            level: environment.debug ? 'debug' : 'info'
        },
        cors: {
            exposeHeaders: 'Link,Etag',
            maxAge: 300,
            hostnames: ['localhost']
        },
        data: {
            provider: 'mssql',
            schema: 'dbo',
            dynamicSchema: true,
            server: 'localhost',
            database: 'master',
            user: 'sa',
            password:  'R43$fof983l!'
        },
        auth: {
            secret: '0000'
        },
        notifications: { },
        storage: { }
    };
};

function basePath() {
    return environment.hosted
        ? (process.env.HOME || '') + "\\site\\wwwroot"
        : path.dirname(require.main.filename);
}
