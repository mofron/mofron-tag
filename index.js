#!/usr/bin/env node
/**
 * @file index.js
 * @brief 
 * @author simparts
 */
var fs = require('fs');
const htmlparser = require("htmlparser2")

var loconf = require('./src/config.js');
var loerr  = require('./src/error.js');
var lopars = require('./src/parse.js');
var loout  = require('./src/output.js');
var locmp  = require('./src/component.js');

try {
    if (4 != process.argv.length) {
        loerr.usage();
    }
    
    fs.readFile(process.argv[2], 'utf8', function (err, text) {
        try {
            if (null !== err) {
                loerr.usage();
            }

            var ptag = lopars.filter(htmlparser.parseDOM(text));
            if (null === ptag) {
                throw new Error('invalid contents');
            }
            
            var comp = new Array();
            for (var idx in ptag) {
                if ('config' === ptag[idx].name) {
                    loconf.init(ptag[idx]);
                } else if ('component' === ptag[idx].name) {
                    comp.push(ptag[idx]);
                }
            }
            
            for (var idx in comp) {
                locmp.parse(comp[idx]);
            }
            
            loout.write(process.argv[3]);
        } catch (e) {
            throw e;
        }
    });
} catch (e) {
    throw e;
}
/* end of file */
