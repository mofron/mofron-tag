/**
 * @file component.js
 * @brief convert tag to js for component
 * @author simparts
 */
let thisobj = null;

let list = [];

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

let getValue = (prm) => {
    try {
        let sp_str = prm.split(',');
        if (1 === sp_str.length) {
            return (true === isNumStr(sp_str[0])) ? sp_str[0] : "'" + sp_str[0] + "'";
        } else {
            let ret = '[';
            for (let sidx in sp_str) {
                ret += (true === isNumStr(sp_str[0])) ? sp_str[sidx] : "'" + sp_str[sidx] + "'";
                ret += ',';
            }
            return ret + "]";
        }
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

let findValue = (atr, key) => {
    try {
        for (let aidx in atr) {
            if (key === atr[aidx].name) {
                return atr[aidx].value;
            }
        }
        return null;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

let filterAttr = (atr, tgt) => {
    try {
        let ret = [];
        let chk_tgt = (true === Array.isArray(tgt) ? tgt : [tgt]);
        
        let hit = false;
        for (let aidx in atr) {
            hit = false;
            for (let tidx in chk_tgt) {
                if (atr[aidx].name === chk_tgt[tidx]) {
                    hit = true;
                    break;
                }
            }
            if (false === hit) {
                ret.push(atr[aidx]);
            }
        }
        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }

    thisobj = {
        add: (prm) => {
            try {
                list.push(prm);
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        option: (attr) => {
            try {
                let ret = "";
                for (let aidx in attr) {
                    ret += attr[aidx].name + ':';
                    if ( ('effect' === attr[aidx].name) ||
                         ('layout' === attr[aidx].name) ||
                         ('event'  === attr[aidx].name) ) {
                        ret += 'new ' + attr[aidx].value + ',';
                    } else {
                        ret += getValue(attr[aidx].value) + ',';
                    }
                }
                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        config: (prm) => {
            try {
                let ret = "";
                if ( ('effect' !== prm.tag) &&
                     ('layout' !== prm.tag) &&
                     ('event'  !== prm.tag) ) {
                    return ret;
                }
                ret += prm.tag + ': [';
                for (let cidx in prm.atrobj) {
                    ret += 'new ' + prm.atrobj[cidx].tag + '({' + thisobj.option(prm.atrobj[cidx].attrs) + '}),'
                }
                ret += '],';
                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        optobj: (prm) => {
            try {
                let ret = "";
                if ('option' !== prm.tag) {
                    return ret;
                }
                for (let cidx in prm.atrobj) {
                    let tgt = findValue(prm.atrobj[cidx].attrs, 'target');
                    if (null === tgt) { 
                        throw new Error('could not find target');
                    }
                    ret += tgt + ': new mf.Option({';
                    ret += thisobj.option(
                               filterAttr(prm.atrobj[cidx].attrs, 'target')
                           );
                    if (null !== prm.atrobj[cidx].text) {
                        ret += 'text: "' + prm.atrobj[cidx].text + '",'
                    }
                    ret += '}),';
                }
                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        theme: (prm) => {
            try {
                let ret = "";
                if ('theme' !== prm.tag) {
                    return ret;
                }
                ret += 'theme: [';
                for (let cidx in prm.child) {
                    ret += "[";
                    let tgt = findValue(prm.child[cidx].attrs, 'target');
                    if (null === tgt) {
                        throw new Error('could not find target');
                    }
                    ret += "'" + tgt + "',";
                    if (1 < prm.child[cidx].attrs.length) {
                        let chd = prm.child[cidx];
                        chd.attrs = filterAttr(prm.child[cidx].attrs, "target");
                        ret += thisobj.convjs([chd]);
                    } else {
                        ret += prm.child[cidx].tag;
                    }
                    ret += "]";
                }
                ret += '],'
                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        convjs: (lst) => {
            try {
                let ret = '';
                for (let lidx in lst) {
                    ret += 'new ' + lst[lidx].tag + '({'+ thisobj.option(lst[lidx].attrs);
                    for (let cnf_idx in lst[lidx].atrobj) {
                        ret += thisobj.config(lst[lidx].atrobj[cnf_idx]);
                        ret += thisobj.optobj(lst[lidx].atrobj[cnf_idx]);
                        ret += thisobj.theme(lst[lidx].atrobj[cnf_idx]);
                    }
                    
                    if (0 === lst[lidx].child) {
                        ret += '}),';
                        continue;
                    }
                    for (let cidx in lst[lidx].child) {
                        ret += 'child: [' + thisobj.convjs(lst[lidx].child) + ']';
                    }
                    ret += '}),';
                }
                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        script: () => {
            try {
                return thisobj.convjs(list);
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
