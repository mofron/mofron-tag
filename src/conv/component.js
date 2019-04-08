/**
 * @file component.js
 * @brief convert tag to js for component
 * @author simparts
 */
let thisobj = null;
let declare = [];

let script  = "";
let count   = 0;

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

let isName = (prm) => {
    try {
        for (let aidx in prm.attrs) {
            if ('name' === aidx) {
                return true;
            }
        }
        return false;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

let setName = (prm) => {
    try {
        if (true === Array.isArray(prm)) {
            let ret = [];
            for (let pidx in prm) {
                ret.push(setName(prm[pidx]));
            }
            return ret;
        }
        
        if ('string' !== typeof prm) {
            return prm;
        }
        let mch = prm.match(/[@]\w+/g);
        if ((null !== mch) && (1 === mch.length)) {
            return prm.replace(mch[0], 'mf.objkey.' + mch[0].substring(1));
        }
        return prm;
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
        theme: (prm) => {
            try {
                let ret     = "{";
                let thm_cnt = null;
                for (let pidx in prm) {
                    if (undefined === prm[pidx].attrs.target) {
                        /* replace type is option */
                        ret += prm[pidx].tag + ':';
                        ret += '{' + thisobj.attrs(prm[pidx].attrs) + '}';
                    } else {
                        ret += prm[pidx].attrs.target + ':';
                        delete prm[pidx].attrs.target;
                    
                        if (1 > Object.keys(prm[pidx].attrs).length) {
                            /* replace type is class */
                            ret += prm[pidx].tag;
                        } else {
                            /* replace type is class with option */
                            ret += '[' + prm[pidx].tag + ',';
                            ret += '{' + thisobj.attrs(prm[pidx].attrs) + '}]';
                        }
                    }
                    ret += ",";
                    
                }
                ret = ret.substring(0, ret.length-1);
                return ret + "}";
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        extopt: (prm) => {
            try {
                let ret = "";
                for (let pidx in prm.attrs) {
                    ret += pidx + ":";
                    ret += "new mf.Option({";
                    if (null !== prm.attrs[pidx].text) {
                        ret += "text: '" + prm.attrs[pidx].text + "',";
                    }
                    ret += thisobj.attrs(prm.attrs[pidx].attrs);
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
                    ret += "new " + aidx + "({";
                    ret += thisobj.attrs(prm.attrs[aidx].attrs) + "})";
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
                    let nme = aidx + ':';
                    let val = prm[aidx]; //setName(prm[aidx]);

                    if ('style' === aidx) {
                        ret += 'style:' + thisobj.style(val) + ',';
                    } else if ('option' === aidx) {
                        ret += thisobj.extopt(val) + ',';
                    } else if ('theme' === aidx) {
                        ret += nme + thisobj.theme(val.attrs) + ',';
                    } else if ('name' === aidx) {
                        ret += 'objkey:';
                        ret += (true === isComment(val)) ? val : '"' + val + '"';
                        ret += ',';
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
                        throw new Error('unknown attrs:' + aidx);
                    }
                }
                return ret.substring(0, ret.length-1);
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        add : (cmp) => {
            try {
                count++;
                let buf = "";
                cmp.name = (undefined === cmp.attrs.name) ? "cmp" + count : cmp.attrs.name;
                buf = "let " + cmp.name + "=";
                buf += "new ";
                buf += ('Component' === cmp.tag) ? 'mf.' : '';
                buf += cmp.tag + "({";
                
                /* add text */
                //if (null !== cmp.text) {
                //    buf += 'text: "' + cmp.text + '",'
                //}
                /* add attrs */
                //let atr = thisobj.attrs(cmp.attrs);
                //if ("" !== atr) {
                //    buf += atr;
                //    buf += (0 !== cmp.child.length) ? "," : "";
                //}

                buf += "});\n";
                /* add child */
                if (0 !== cmp.child.length) {
                    for (let ch_idx in cmp.child) {
                        thisobj.add(cmp.child[ch_idx]);
                    }
                 //       buf += "child: ["
                 //       buf += thisobj.toScript(cmp[cmp_idx].child, true);
                 //       buf += "]"
                }
                declare.push(buf);
                
                    //if (true === isName(cmp[cmp_idx])) {
                    //    let nm = cmp[cmp_idx].attrs.name;
                    //    ret += 'mf.objkey.';
                    //    ret += (true === isComment(nm)) ? nm.substring(1, nm.length-1) : nm;
                    //    ret += ',';
                    //    cmplist.push(buf);
                    //} else {
                    //    ret += buf;
                    //}
                //}
                
                //if (true === rec) {
                //    return ret.substring(0, ret.length-1);
                //} else {
                //    let lst = 'let comp=[';
                //    for (let lidx in cmplist) {
                //        lst += cmplist[lidx];
                //    }
                //    lst += '];\n';
                //    
                //    ret = 'module.exports=[\n        ' + ret + '\n    ];\n';
                //    return lst + ret;
                //}
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        child: (cmp) => {
            try {
                let ret  = (0 < cmp.child.length) ? cmp.name + ".child([" : "";
                let buf  = "";
                let name = [];
                for (let cidx in cmp.child) {
                    name.push(cmp.child[cidx].name);
                    buf += thisobj.child(cmp.child[cidx]);
                }
                for (let nidx in name) {
                    ret += name[nidx] + ',';
                }
                if (0 < cmp.child.length) {
                    ret = "    " + ret.substring(0, ret.length-1) + "]);\n";
                    
                }
                return ret + buf;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        option: (cmp) => {
            try {
                let ret = "    " + cmp.name + ".option({";
                /* add text */
                if (null !== cmp.text) {
                    ret += 'text: "' + cmp.text + '",'
                }
                /* add attrs */
                ret += thisobj.attrs(cmp.attrs);
                ret.substring(0, ret.length-1);
                ret += "});\n";
                
                let buf  = "";
                for (let cidx in cmp.child) {
                    buf += thisobj.option(cmp.child[cidx]);
                }
                return ret + buf;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        toScript: (cmp_lst) => {
            try {
                let ret = "";
                for (let cidx in cmp_lst) {
                    thisobj.add(cmp_lst[cidx]);
                }
                
                /* declare area */
                for (let dc_idx in declare) {
                    ret += "    " + declare[dc_idx];
                }
                /* struct area */
                for (let cidx2 in cmp_lst) {
                    ret += thisobj.child(cmp_lst[cidx2]);
                }
                /* option area */
                for (let cidx3 in cmp_lst) {
                    ret += thisobj.option(cmp_lst[cidx3]);
                }
                
                /* return area */
                ret += "    module.exports=[";
                for (let cidx4 in cmp_lst) {
                    ret += cmp_lst[cidx4].name + ",";
                }
                ret = ret.substring(0, ret.length-1);
                ret += "];\n";
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
