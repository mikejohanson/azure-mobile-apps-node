// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
module.exports = {
    // parse an ODBC or ADO.NET connection string into
    parse: function (connectionString) {
        if (!connectionString)
            return {};

        var properties = parseProperties(connectionString),
            server = parseServer(properties['server'] || properties['data source']);

        let x = connectionString && {
            provider: 'mssql',
            server: server,
            port: parsePort(properties['server'] || properties['data source'] || properties['datasource']),
            database: properties['database'] || properties['initial catalog'] || properties['initialcatalog'],
            connectionTimeout: (parseInt(properties['connection timeout'] || properties['connectiontimeout']) * 1000) || 15000,
            requestTimeout: (parseInt(properties['request timeout'] || properties['requesttimeout']) * 1000) || 15000,
            authentication:{
                type: properties['authentication type'] || 'default'
            },
            options: {
                // Azure requires encryption
                encrypt: module.exports.serverRequiresEncryption(server) || parseBoolean(properties['encrypt']),
                clientId: properties['client id'] 
            }
        };

        if(properties['authentication type'] == null) {
            x.user = properties['user id'] || properties['userid'] ||  properties['uid']
            x.password = properties['password'] || properties['pwd']
        }

        return x;

        function parseServer(value) {
            if(!value)
                return '';

            var start = value.indexOf(':'),
                end = value.lastIndexOf(',');

            return value.substring(start + 1, end === -1 ? undefined : end);
        }

        function parsePort(value) {
            if(!value)
                return 1433;

            var start = value.lastIndexOf(',');
            return start === -1 ? undefined : parseInt(value.substring(start + 1));
        }

        function parseBoolean(value) {
            value = value && value.toLowerCase();
            return !!(value === 'true' || value === 'yes');
        }

        function parseProperties(source) {
            return source.split(';').reduce(function (properties, property) {
                var keyValue = property.split('='),
                    key = keyValue[0].toLowerCase(),
                    value = keyValue.length > 1 && keyValue[1];

                if(key)
                    properties[key] = value;

                return properties;
            }, {});
        }
    },
    serverRequiresEncryption: function (server) {
        return server && (server.indexOf('database.windows.net') > -1
            || server.indexOf('database.usgovcloudapi.net') > -1
            || server.indexOf('database.cloudapi.de') > -1
            || server.indexOf('database.chinacloudapi.cn') > -1);
    }
};
