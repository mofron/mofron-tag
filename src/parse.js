/**
 * @file parse.js
 * @author simpart
 */
var thisobj  = null;

try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }
    
    thisobj = {
        filter : function (tg) {
            try {
                var ret = new Array();
                for (var idx in tg) {
                    if ('tag' !== tg[idx].type) {
                        continue;
                    }
                    ret.push(tg[idx]);
                }
                return (0 === ret.length) ? null : ret;
            } catch (e) {
                throw e;
            }
        }
    }
    module.exports = thisobj;
} catch (e) {
    throw e;
}
/* end of file */
