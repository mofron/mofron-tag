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
        getParam: (txt) => {
            try {
                if ('string' !== typeof txt) {
                    return '' + txt;
                }
                /* check instance */
                if ( (false === thisobj.isComment(txt)) &&
                     (null !== txt.match(/\w+[(].*[)]/g)) ) {
                    return 'new ' + txt;
                }
                
                let ret     = "";
                let chk_prm = txt.match(/[(][^(]+[)]/g);
                if (null === chk_prm) {
                    /* single parameter */
                    let sp_txt = txt.split(',');
                    if (1 === sp_txt.length) {
                        if ('@' === txt[0]) {
                            ret += txt.substring(1);
                        } else if ( (true === thisobj.isComment(txt)) ||
                                    (true === thisobj.isNumStr(txt))  ||
                                    (("true" === txt) || "false" === txt) ) {
                            ret += txt;
                        } else if ( ('[' === txt[0]) && (']' === txt[1]) ) {
                            ret += txt;
                        } else {
                            ret += '"' + txt + '"';
                        }
                    } else {
                        ret += '[';
                        /* array parameter */
                        for (let sp_idx in sp_txt) {
                            ret += thisobj.getParam(sp_txt[sp_idx]) + ',';
                        }
                        ret = ret.substring(0, ret.length-1);
                        ret += ']';
                    }
                } else if (true === Array.isArray(chk_prm)) {
                    /* multiple parameter */
                    ret += "new mf.Param("
                    for (let cidx in chk_prm) {
                        ret += thisobj.getParam(chk_prm[cidx].substring(1,chk_prm[cidx].length-1)) + ',';
                    }
                    ret = ret.substring(0, ret.length-1);
                    ret += ")";
                } else {
                    throw new Error("invalid parameter");
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
