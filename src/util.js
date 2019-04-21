/**
 * @file util.js
 * @brief util functions
 * @author simparts
 */
let thisobj = null;
let dec_cnt = 0;

try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }
    
    thisobj = {
        isComment: (prm) => {
            try {
                if (("'" === prm[0]) && ("'" === prm[prm.length-1])) {
                    return true;
                } else if (('"' === prm[0]) && ('"' === prm[prm.length-1])) {
                    return true;
                }
                return false;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        
        isNumStr: (str) => {
            try {
                if ('string' !== typeof str) {
                    return false;
                }
                let chk = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                let num = false;
                for (let sidx=0;sidx < str.length; sidx++) {
                    for (let cidx in chk) {
                        if (str[sidx] === chk[cidx]) {
                            num = true;
                            break;
                        }
                    }
                    if (false === num) {
                        return false;
                    }
                    num = false;
                }
                return true;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
    }
    module.exports = thisobj;
} catch (e) {
    console.error(e.stack);
    throw e;
}
/* end of file */
