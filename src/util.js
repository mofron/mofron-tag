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
        
        getCamel: (txt) => {
            try {
                /* check parameter */
                if ( ('string' !== (typeof txt)) ||
                     ((txt.length-1) === txt.lastIndexOf('-')) ) {
                    throw new Error('invalid parameter');
                } else if (-1 === txt.indexOf('-')) {
                    return txt;
                }
                let ret    = "";
                let sp_txt = txt.split('-');
                for (let sp_idx in sp_txt) {
                    if (0 == sp_idx) {
                         ret += sp_txt[sp_idx];
                         continue;
                    }
                    ret += sp_txt[sp_idx].charAt(0).toUpperCase();
                    ret += sp_txt[sp_idx].substr(1);
                }
                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        
        getParam: (prm) => {
            try {
	        let ret = "";
                if (true === Array.isArray(prm)) {
                    ret += "[";
		    for (let pidx in prm) {
                        ret += thisobj.getParam(prm[pidx]) + ',';
		    }
		    ret = ret.substring(0, ret.length-1) + "]";
		} else if ("string" === typeof prm) {
                    if ( (true === thisobj.isComment(prm)) || (true === thisobj.isNumStr(prm)) ) {
                        ret += prm;
		    } else if (null !== prm.match(/\w+[(].*[)]/g)) {
                        ret += 'new ' + prm;
		    } else if ( ('[' === prm[0]) && (']' === prm[1]) ) {
                        ret += prm;
		    } else if ("@" === prm[0]) {
                        ret += prm.substr(1);
		    } else if ( ("true" === prm) || ("false" === prm) || ("null" === prm) ) {
		        ret += prm;
		    } else {
                        ret += ("@" === prm[0]) ? prm.substr(1) :  '"' + prm + '"';
		    }
		} else if ("number" === typeof prm) {
		    ret += prm;
		} else {
                    console.log(prm);
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
