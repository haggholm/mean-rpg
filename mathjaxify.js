'use strict';

var options = {excludeExtensions: ['.json']};
module.exports = transformTools.makeStringTransform("unbluify", options,
    function (content, transformOptions, done) {
        var file = transformOptions.file;
        if(!transformOptions.config) {
            return done(new Error("Could not find unbluify configuration."));
        }

        done(null, content.replace(/blue/g, transformOptions.config.newColor));
    });
