/**
 * @file Options.js
 * @brief option script generator
 * @author simparts
 */
const Base = require('./BaseGen.js');
const util = require('./util.js');

module.exports = class extends Base {
    
    constructor (opt) {
        try {
            super(opt);
            this.gencnf().autoComment = (undefined !== opt.autoComment) ? opt.autoComment : true;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    style (prm) {
        try {
            if ('object' === typeof prm) {
                return this.style("'" + prm.text + "'");
            }
            prm = prm.substring(1, prm.length-1);
            let ret = "style:{";
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
    }
    
    option (prm) {
        try {
             let ret = "";
             for (let pidx in prm.attrs) {
                 ret += pidx + ":";
                 ret += "new mf.Option(";
                 ret += this.optgen(prm.attrs[pidx]);
                 ret += ")";
             }
             return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    theme (prm) {
        try {
            let ret     = "theme:{";
            let thm_cnt = null;
            for (let pidx in prm.attrs) {
                if (undefined === prm.attrs[pidx].target) {
                    /* replace type is option */
                    ret += prm.attrs[pidx].tag + ':';
                    ret += this.optgen(prm.attrs[pidx]);
                } else {
                    ret += prm.attrs[pidx].target + ':';
                    delete prm.attrs[pidx].target;
                    
                    if (1 > Object.keys(prm.attrs[pidx]).length) {
                        /* replace type is class */
                        ret += prm.attrs[pidx].tag;
                    } else {
                        /* replace type is class with option */
                        ret += '[' + prm.attrs[pidx].tag + ',';
                        ret += '{' + this.optgen(prm.attrs[pidx]) + '}]';
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
    }
    
    template () {return "";}
    
    name (prm) {
        try {
            let ret = 'objkey:';
            if (true === this.gencnf().autoComment) {
                ret += (true === util.isComment(prm)) ? prm : '"' + prm + '"';
            } else {
                ret += prm;
            }
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    otheropt (nm, prm) {
        try {
            let ret = "";
            if ('string' === typeof prm) {
                ret += nm + ":";
                if ( (false === util.isComment(prm)) &&
                     ('number' !== typeof prm) &&
                     (null !== prm.match(/\w+[(].*[)]/g)) ) {
                    ret += 'new ';
                }
                ret += prm;
            } else if (true === Array.isArray(prm)) {
                ret += nm + ':[';
                for (let vidx in prm) {
                    if ( (false === util.isComment(prm[vidx])) &&
                         ('number' !== typeof prm[vidx]) &&
                         (null !== prm[vidx].match(/\w+[(].*[)]/g)) ) {
                        ret += 'new ';
                    }
                    ret += prm[vidx]+',' ;
                }
                ret = ret.substring(0, ret.length-1);
                ret += ']';
            } else if ('object' === typeof prm) {
                let ret = nm + ":";
                ret += (1 < prm.attrs.length) ? "[" : "";
                for (let aidx in prm) {
                    ret += "new " + aidx + "(";
                    ret += this.optgen(prm.attrs[aidx]) + ")";
                }
                ret += (1 < prm.length) ? "]" : "";
            } else {
                throw new Error('unknown attrs:' + aidx);
            }
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    optgen (cmp) {
        try {
            let ret = "{";
            if (null !== cmp.text) {
                ret += "text: ";
                if (true === this.gencnf().autoComment) {
                    ret += (true === util.isComment(cmp.text)) ? cmp.text : '"' + cmp.text + '"';
                } else {
                    ret += cmp.text;
                }
                ret += ",";
            }
            for (let aidx in cmp.attrs) {
                if ( ('function' === typeof this[aidx]) &&
                     ('otheropt' !== typeof this[aidx]) &&
                     ('toScript' !== aidx) &&
                     ('gencnf' !== aidx) &&
                     ('optgen' !== aidx) ) {
                    ret += this[aidx](cmp.attrs[aidx]);
                } else {
                    ret += this.otheropt(aidx, cmp.attrs[aidx]);
                }
                ret += ",";
            }
            return (',' === ret[ret.length-1]) ? ret.substring(0, ret.length-1) + "}" : ret + "}";
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    toScript (cmp) {
        try {
            let ret = (false === this.gencnf().minify) ? "    " : "";
            ret += cmp.name + ".option(";
            /* add attrs */
            ret += this.optgen(cmp);
            ret += ");";
            ret += (false === this.gencnf().minify) ? "\n" : "";

            let buf  = "";
            for (let cidx in cmp.child) {
                buf += this.toScript(cmp.child[cidx]);
            }
            return ret + buf;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
