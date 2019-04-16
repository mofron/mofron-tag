/**
 * @file Options.js
 * @brief option script generator
 * @author simparts
 */
const Base = require('./BaseGen.js');
const util = require('./util.js');

let option = class extends Base {
    
    constructor (opt) {
        try {
            super(opt);
            if (undefined === this.gencnf().autoComment) {
                this.gencnf().autoComment = true;
            }
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
    }
    
    option (prm) {
        try {
            this.m_optkey = null;
            let ret = "";
            for (let pidx in prm.attrs) {
                 ret += prm.attrs[pidx].tag + ":";
                 ret += "new mf.Option(";
                 ret += new option()._optgen(prm.attrs[pidx]);
                 ret += "),";
            }
             return ret.substring(0, ret.length-1);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    theme (prm) {
        try {
            let ret     = "{";
            let thm_cnt = null;
            for (let pidx in prm.child) {
                if (undefined === prm.child[pidx].target) {
                    /* replace type is option */
                    ret += prm.child[pidx].tag + ':';
                    ret += new option()._optgen(prm.child[pidx]);
                } else {
                    ret += prm.child[pidx].target + ':';
                    delete prm.child[pidx].target;
                    
                    if (1 > Object.keys(prm.child[pidx]).length) {
                        /* replace type is class */
                        ret += prm.child[pidx].tag;
                    } else {
                        /* replace type is class with option */
                        ret += '[' + prm.child[pidx].tag + ',';
                        ret += '{' + new option()._optgen(prm.child[pidx]) + '}]';
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
    
    
    name (prm) {
        try {
            let ret = "";
            this.m_optkey = 'objkey';
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
    
    _otheropt (prm) {
        try {
            let ret = "";
            if ('string' === typeof prm) {
                if ( (false === util.isComment(prm)) &&
                     ('number' !== typeof prm) &&
                     (null !== prm.match(/\w+[(].*[)]/g)) ) {
                    ret += 'new ';
                }
                ret += prm;
            } else if ('number' === typeof prm) {
                ret += prm;
            } else if (true === Array.isArray(prm)) {
                ret += '[';
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
                ret += (1 < prm.child.length) ? "[" : "";
                for (let aidx in prm.child) {
                    ret += "new " + prm.child[aidx].tag + "(";
                    ret += new option()._optgen(prm.child[aidx]) + "),";
                }
                ret = ret.substring(0, ret.length-1);
                ret += (1 < prm.child.length) ? "]" : "";
            } else {
                throw new Error('unknown attr:');
            }
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    _optgen (cmp) {
        try {
            let ret = "{";
            if ((undefined !== cmp.text) && (null !== cmp.text)) {
                ret += "text: ";
                if (true === this.gencnf().autoComment) {
                    ret += (true === util.isComment(cmp.text)) ? cmp.text : '"' + cmp.text + '"';
                } else {
                    ret += cmp.text;
                }
                ret += ",";
            }
            
            for (let aidx in cmp.attrs) {
                this.m_optkey = aidx;
                
                if ( ('function' === typeof this[aidx]) &&
                     ('toScript' !== aidx) &&
                     ('gencnf' !== aidx) &&
                     ('_' !== aidx[0]) ) {
                    let optcnt = this[aidx](cmp.attrs[aidx]);
                    ret += (null !== this.m_optkey) ? this.m_optkey + ":" + optcnt : optcnt;
                } else {
                    if ('template' === aidx) {
                        continue;
                    }
                    ret += this.m_optkey + ':' + this._otheropt(cmp.attrs[aidx]);
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
            ret += this._optgen(cmp);
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
module.exports = option;
/* end of file */
