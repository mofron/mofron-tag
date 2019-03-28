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
                let ret    = [];
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
                        if (buf[0] === ret[ridx].name) {
                            ret[ridx].value = buf[1];
                            ret_hit = true;
                            break;
                        }
                    }
                    if (false === ret_hit) {
                        ret.push({ name: buf[0], value: buf[1] });
                    }
                }
                
                for (let ridx2 in ret) {

                    ret[ridx2].value = thisobj.array(ret[ridx2].value);

                    if (true === Array.isArray(ret[ridx2].value)) {
                        for (let vidx in ret[ridx2].value) {
                            if (true === isNumStr(ret[ridx2].value[vidx])) {
                                ret[ridx2].value[vidx] = parseInt(ret[ridx2].value[vidx]);
                            }
                        }
                    } else {
                        if (true === isNumStr(ret[ridx2].value)) {
                            ret[ridx2].value = parseInt(ret[ridx2].value);
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
                
                for (let pidx in sp_prm) {
                    if (true === isHarf(sp_prm[pidx])) {
                        throw new Error('not supported');
                    } else {
                        ret.push(sp_prm[pidx]);
                    }
                }
                return ret;
            } catch (e) {
                console.log(e.stack);
                throw e;
            }
        },
        object: (prm) => {
            try {
                for (let cidx in prm.child) {
                    prm.attrs.push(thisobj.object(prm.child[cidx]));
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
