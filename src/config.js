/**
 * @file config.js
 * @author simpart
 */
var lopars  = require('./parse.js');
var loout   = require('./output.js');
var thisobj = null;

try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }
    
    thisobj = {
        init : function (tag) {
            try {
                var ptag = lopars.filter(tag.children);
                if (null === ptag) {
                    return;
                }
                
                for (var idx in ptag) {
                    if ('mapping' === ptag[idx].name) {
                        thisobj.mapping(ptag[idx]);
                    }
                }
            } catch (e) {
                throw e;
            }
        },
        mapping : function (elm) {
            try {
                var req_str = "let ";
                for (var idx in elm.attribs) {
                    req_str += idx + " = " + "require('" + elm.attribs[idx] + "');\n";
                }
                req_str += "\n";
                loout.add(req_str);
            } catch (e) {
                throw e;
            }
        }
    };
    
    module.exports = thisobj;
} catch (e) {
    throw e;
}
/* end of file */
