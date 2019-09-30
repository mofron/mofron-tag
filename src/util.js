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
                let chk = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
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
        getParam: (prm, po) => {
            try {
	        let ret = "";
                if (true === Array.isArray(prm)) {
                    ret += (true === po) ? "new mf.Param(" : "[";
                    for (let pidx in prm) {
			ret += thisobj.getParam(prm[pidx]) + ',';
                    }
		    ret = ret.substring(0, ret.length-1);
		    ret += (true === po) ? ")" : "]";
		    return ret;
		}
                
                if ('string' !== typeof prm) {
                    return '' + prm;
                }
                /* check instance */
                if ( (false === thisobj.isComment(prm)) &&
                     (null !== prm.match(/\w+[(].*[)]/g)) ) {
                    return 'new ' + prm;
                }
                
                if ('@' === prm[0]) {
                    ret += prm.substring(1);
                } else if ( (true === thisobj.isComment(prm)) ||
                            (true === thisobj.isNumStr(prm))  ||
                            (("true" === prm) || "false" === prm) || ("null" === prm) ) {
                    ret += prm;
                } else if ( ('[' === prm[0]) && (']' === prm[1]) ) {
                    ret += prm;
                } else {
                    ret += '"' + prm + '"';
                }

                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        }
    }
    module.exports = thisobj;
} catch (e) {
    console.error(e.stack);
    throw e;
}
/* end of file */
