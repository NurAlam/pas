var path = require('path'),
    semver = require('semver'),
    fs = require('fs'),
    url = require('url'),
    query = require('../query'),
    mkdirp = require('../fsutil').mkdirp;

var LinkTask = function() {
    'use strict';

    this.description = 'Link local directory as repository package';
};

LinkTask.prototype.exec = function() {
    'use strict';

    var pCurrent;

    if (this.args.length === 0) {
        return query()
            .then(function(q) {
                pCurrent = q.get();
                this.report('message', '%s linked', pCurrent.url);
                return pCurrent.createLink();
            }.bind(this));
    } else {
        var p,
            packageUrlOrObject = this.args[0];
        return query()
            .then(function(q) {
                pCurrent = q.get();
                if (typeof packageUrlOrObject === 'object') {
                    p = packageUrlOrObject;
                } else {
                    var parsed = url.parse(packageUrlOrObject);
                    if (!parsed.protocol) {
                        packageUrlOrObject = 'local:' + packageUrlOrObject;
                    }

                    return query(packageUrlOrObject)
                        .then(function(q) {
                            p = q.get();
                        });
                }
            })
            .then(function() {
                this.report('message', '[%s] linking %s', p.name, p.version);
                return pCurrent.link(p);
            }.bind(this));
    }
};

module.exports = new LinkTask();