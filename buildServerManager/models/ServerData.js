/**
 * Created by Kamaron on 7/11/2015.
 *
 * REQUIRED FOR INDIGO-CODE-BUILDSERVER v0.1 INTERFACE
 *
 * Holds data about the server
 */

var http = require('http');
var BuildSystem;
var ComparisonSystem;

/**
 * Data about a buildserver. Follows v0.1 Indigo Code Buildserver API standard.
 * @param namespace {String} Namespace of the build server. Used by developers to identify their own systems.
 * @param version {String}
 * @param serverName {String} Human readable name of the server
 * @param serverUUID {String} Unique identifier of the server
 * @param buildConstraints {BuildConstraints}
 * @param buildSystems {String} URL to list of build systems supported (as per API standard)
 * @param comparisonSystems {String} URL to list of comparison systems supported (as per API standard)
 * @constructor
 */
var ServerData = function (namespace, version, serverName, serverUUID, buildConstraints, buildSystems, comparisonSystems) {
    /** @type {String} */
    this.namespace = namespace;

    /** @type {String} */
    this.version = version;

    /** @type {String} */
    this.serverName = serverName;

    /** @type {String} */
    this.serverUUID = serverUUID;

    /** @type {BuildConstraints} */
    this.buildConstraints = buildConstraints;

    /**
     * @type {String}
     * @private
     */
    this._buildSystems = buildSystems;

    /**
     * @type {String}
     * @private
     */
    this._comparisonSystems = comparisonSystems;
};

/**
 * @param systemID {String|function (Array.<BuildSystem>)} If included, name of build system in question
 * @param cb {function (Array.<BuildSystem>)|null} Callback that returns list of build systems supported
 */
ServerData.prototype.buildSystem = function (systemID, cb) {
    if (Object.prototype.toString.call(systemID) === '[object Function]') {
        cb = systemID;
        systemID = null;
    }

    http.get(this._buildSystems + (systemID ? ('name=' + systemID) : ''), function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            try {
                var list = JSON.parse(data);
                if (Object.prototype.toString.call(list) === '[object Array]') {
                    cb(list.map(function (element) {
                        return new BuildSystem(
                            element.id,
                            element.name,
                            element.description
                        )
                    }));
                } else {
                    cb([new BuildSystem(
                        list.id,
                        list.name,
                        list.description
                    )]);
                }
            } catch (e) {
                console.log('ServerData.buildSystems() JSON Parse error: ' + e.message);
                cb([]);
            }
        });
    }).on('error', function (e) {
        console.log('ServerData.buildSystems() error: ' + e.message);
        cb([]);
    });
};

/**
 * @param systemID {String|function (Array.<BuildSystem>)} If included, name of comparison system in question
 * @param cb {function (Array.<BuildSystem>)|null} Callback that returns list of comparison systems supported
 */
ServerData.prototype.buildSystem = function (systemID, cb) {
    if (Object.prototype.toString.call(systemID) === '[object Function]') {
        cb = systemID;
        systemID = null;
    }

    http.get(this._comparisonSystems + (systemID ? ('name=' + systemID) : ''), function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            try {
                var list = JSON.parse(data);
                if (Object.prototype.toString.call(list) === '[object Array]') {
                    cb(list.map(function (element) {
                        return new ComparisonSystem(
                            element.id,
                            element.name,
                            element.description
                        )
                    }));
                } else {
                    cb([new ComparisonSystem(
                        list.id,
                        list.name,
                        list.description
                    )]);
                }
            } catch (e) {
                console.log('ServerData.buildSystems() JSON Parse error: ' + e.message);
                cb([]);
            }
        });
    }).on('error', function (e) {
        console.log('ServerData.buildSystems() error: ' + e.message);
        cb([]);
    });
};

module.exports.ServerData = ServerData;

BuildSystem = require('./BuildSystemData');
ComparisonSystem = require('./ComparisonSystem');