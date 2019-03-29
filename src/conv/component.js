/**
 * @file component.js
 * @brief convert tag to js for component
 * @author simparts
 */
let thisobj = null;

let isComment = (prm) => {
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
};


try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }

    thisobj = {
        option: (prm) => {
            try {
                let ret = "";
                for (let pidx in prm.attrs) {
                    ret += prm.attrs[pidx].name + ":";
                    ret += "new mf.Option({";
                    if (null !== prm.attrs[pidx].value.text) {
                        ret += "text: '" + prm.attrs[pidx].value.text + "',";
                    }
                    ret += thisobj.attrs(prm.attrs[pidx].value.attrs);
                    ret += "})";
                }
                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        style: (prm) => {
            try {
                if ('object' === typeof prm) {
                    return thisobj.style("'" + prm.text + "'");
                }
                prm = prm.substring(1, prm.length-1);
                let ret = "{";
                /* delete space */
                let nsp     = prm.split(' ');
                let nsp_str = "";
                for (let nsp_idx in nsp) {
                    nsp_str += nsp[nsp_idx];
                }
                /* set every element */
                let sp_prm = nsp_str.split(';');
                sp_prm.pop();
                let sp_elm = null;
                for (let sp_idx in sp_prm) {
                    sp_elm = sp_prm[sp_idx].split(':');
                    if (2 !== sp_elm.length) {
                        throw new Error('invalid style');
                    }
                    ret += "'" + sp_elm[0] + "':";
                    ret += "'" + sp_elm[1] + "',";
                }
                ret = ret.substring(0, ret.length-1);
                return ret + "}";
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        atrobj: (prm) => {
            try {
                let ret = "";
                ret += (1 < prm.attrs.length) ? "[" : "";
                
                for (let aidx in prm.attrs) {
                    ret += "new " + prm.attrs[aidx].name + "({";
                    ret += thisobj.attrs(prm.attrs[aidx].value.attrs) + "})";
                }
                ret += (1 < prm.attrs.length) ? "]" : "";
                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        attrs: (prm) => {
            try {
                let ret = "";
                for (let aidx in prm) {
                    let nme = prm[aidx].name + ':';
                    let val = prm[aidx].value;
                    
                    if ('style' === prm[aidx].name) {
                        ret += 'style:' + thisobj.style(val) + ',';
                    } else if ('option' === prm[aidx].name) {
                        ret += thisobj.option(val) + ',';
                    } else if ('string' === typeof val) {
                        ret += nme;
                        if ( (false === isComment(val)) && 
                             ('number' !== typeof val) &&
                             (null !== val.match(/\w+[(].*[)]/g)) ) {
                            ret += 'new ';
                        }
                        ret += val+',';
                    } else if (true === Array.isArray(val)) {
                        ret += nme + '[';
                        for (let vidx in val) {
                            if ( (false === isComment(val[vidx])) &&
                                 ('number' !== typeof val[vidx]) &&
                                 (null !== val[vidx].match(/\w+[(].*[)]/g)) ) {
                                ret += 'new ';
                            }
                            ret += val[vidx]+',' ;
                        }
                        ret = ret.substring(0, ret.length-1);
                        ret += '],';
                    } else if ('object' === typeof val) {
                        ret += nme + thisobj.atrobj(val) + ',';
                    } else {
                        throw new Error('unknown attrs:' + prm[aidx].name);
                    }
                }
                return ret.substring(0, ret.length-1);
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        toScript: (cmp) => {
            try {
                let ret = "";
                for (let cmp_idx in cmp) {
                    ret += "new ";
                    ret += ('Component' === cmp[cmp_idx].tag) ? 'mf.' : '';
                    ret += cmp[cmp_idx].tag + "({";
                    
                    /* add text */
                    if (null !== cmp[cmp_idx].text) {
                        ret += 'text: "' + cmp[cmp_idx].text + '",'
                    }
                    
                    /* add attrs */
                    let atr = thisobj.attrs(cmp[cmp_idx].attrs);
                    if ("" !== atr) {
                        ret += thisobj.attrs(cmp[cmp_idx].attrs) + ",";
                    }
                    /* add child */
                    if (0 !== cmp[cmp_idx].child.length) {
                        ret += "child: ["
                        ret += thisobj.toScript(cmp[cmp_idx].child);
                        ret += "]"
                    }
                    ret += "}),"
                }
                
                return ret.substring(0, ret.length-1);
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
