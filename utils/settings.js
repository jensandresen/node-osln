module.exports = {

    getName: function() {
        const info = require("./../package.json");
        return info.name;
    },

    getVersion: function() {
        const info = require("./../package.json");
        return info.version;
    },

    getExcludedPath: function() {
        return [/node_modules/];
    }

};