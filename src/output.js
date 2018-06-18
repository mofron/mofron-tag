/**
 * @file output.js
 * @author simpart
 */
var fs = require('fs');
var thisobj  = null;

try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }
    
    thisobj = {
        string : "",
        add : function (val) {
            try {
                thisobj.string += val;
            } catch (e) {
                throw e;
            }
        },
        write : function (pth) {
            try {
//console.log((-1 === pth.indexOf('.')) ? pth : process.cwd() + "/" + pth);
                fs.writeFile(
                    pth,
                    thisobj.string,
                    (err) => {
                        //console.log(err);
                    }
                );
                //    (-1 === pth.indexOf('.')) ? pth : process.cwd() + "/" + pth,
                //    thisobj.string
                //);
                //console.log(pth);
                //fs.writeFile();
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
