/**
 * @file ctrl.js
 * @author simpart
 */

var thisobj = null;

try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }
    
    thisobj = {
        parse : function () {
            
        }
    }
    
    module.exports = thisobj;
} catch (e) {
    throw e;
}
/* end of file */
