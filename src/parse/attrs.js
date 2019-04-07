/**
 * @file attrs.js
 * @brief parse attribute
 * @author simparts
 */

let thisobj = null;

let isNumStr = (str) => {
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
};


try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }

    thisobj = {
        text: (txt) => {
            try {
                if (0 === txt.length) {
                    return [];
                }
                let ret    = {};
                let attrs  = txt.split(' ');
                let buf    = null;
                let isharf = false;
                for (let aidx in attrs) {
                    if (true === isharf) {
                        if ( ('"' === attrs[aidx][attrs[aidx].length-1]) ||
                             ("'" === attrs[aidx][attrs[aidx].length-1]) ) {
                            /* end harf */
                            isharf = false;
                        }
                        buf[1] += " " + attrs[aidx];
                    } else {
                        buf = attrs[aidx].split('=');
                        if ( (('"' === buf[1][0]) && ('"' !== buf[1][buf[1].length-1])) ||
                             (("'" === buf[1][0]) && ("'" !== buf[1][buf[1].length-1])) ) {
                            /* harf attr value */
                            isharf = true;
                            continue;
                        }
                    }
                    let ret_hit = false;
                    for (let ridx in ret) {
                        if (buf[0] === ridx) {
                            /* replace attr value */
                            ret[ridx] = buf[1];
                            ret_hit = true;
                            break;
                        }
                    }
                    if (false === ret_hit) {
                        ret[buf[0]] = buf[1];
                    }
                }
                
                for (let ridx2 in ret) {
                    
                    ret[ridx2] = thisobj.array(ret[ridx2]);
                    
                    if (true === Array.isArray(ret[ridx2])) {
                        for (let vidx in ret[ridx2]) {
                            if (true === isNumStr(ret[ridx2][vidx])) {
                                ret[ridx2][vidx] = parseInt(ret[ridx2][vidx]);
                            }
                        }
                    } else {
                        if (true === isNumStr(ret[ridx2])) {
                            ret[ridx2] = parseInt(ret[ridx2]);
                        }
                    }
                }
                return ret;
            } catch (e) {
                console.log(e.stack);
                throw e;
            }
        },
        array: (prm) => {
            try {
                let isHarf = (p1) => {
                    try {
                        if ("'" === p1[0]) {
                            return ("'" === p1[p1.length-1]) ? false : true;
                        } else if ('"' === p1[0]) {
                            return ('"' === p1[p1.length-1]) ? false : true;
                        } else if (p1.match(/\w+[(]/g)) {
                            return (')' === p1[p1.length-1]) ? false : true;
                        }
                        return false;
                    } catch (e) {
                        console.log(e.stack);
                        throw e;
                    }
                }
                let ret = [];
                let sp_prm = prm.split(',');
                if (1 === sp_prm.length) {
                    return prm;
                }
                
                let sp_buf = null;
                for (let sp_idx=0; sp_idx < sp_prm.length ;sp_idx++) {
                    if (true === isHarf(sp_prm[sp_idx])) {
                        if ((sp_idx+1) >= sp_prm.length) {
                            throw new Error('invalid attr: ' + sp_prm[sp_idx]);
                        }
                        sp_buf = sp_prm[sp_idx] + ',' + sp_prm[sp_idx+1];
                        sp_prm[sp_idx] = sp_buf;
                        sp_prm.splice(sp_idx+1, 1);
                        sp_idx = -1;
                        continue;
                    }
                }
                
                for (let sp_idx2 in sp_prm) {
                    ret.push(sp_prm[sp_idx2]);
                }
                return ret;
            } catch (e) {
                console.log(e.stack);
                throw e;
            }
        },
        object: (prm) => {
            try {
                let chd_atr = null;
                for (let cidx in prm.child) {
                    chd_atr = thisobj.object(prm.child[cidx]);
                    prm.attrs[chd_atr.name] = chd_atr.value;
                }
                prm.child = [];
                return { name: prm.tag, value: prm };
            } catch (e) {
                console.log(e.stack);
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
