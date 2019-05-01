/**
 * @file Options.js
 * @brief option script generator
 * @author simparts
 */
const Base   = require('./BaseGen.js');
const Style  = require('./opt/Style.js');
const Theme  = require('./opt/Theme.js');
const Respsv = require('./opt/Respsv.js');
const util   = require('../util.js');

module.exports = class extends Base {
    
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
        try { return new Style({ minify: true }).toScript(prm); } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    theme (prm) {
        try { return new Theme({ minify: true }, this).toScript(prm); } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    respsv (prm) {
        try { return new Respsv({ minify: true }, this).toScript(prm); } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    option (prm) {
        try {
            let ret = "";
            for (let pidx in prm.attrs) {
                ret += prm.attrs[pidx].tag + ":";
                ret += "new mf.Option(" + this._optgen(prm.attrs[pidx]) + "),";
            }
            return ret.substring(0, ret.length-1);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    name (prm) {
        try {
            let ret = "objkey: ";
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
                for (let cidx in prm.child) {
                    ret += "new " + prm.child[cidx].tag + "(";
                    if ( (('layout' === prm.tag) || ('event' === prm.tag) || ('effect' === prm.tag)) &&
                         (null !== prm.child[cidx].text) ) {
                        ret += prm.child[cidx].text;
                        ret += "),";
                    } else {
                        ret += this._optgen(prm.child[cidx]) + "),";
                    }
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
                //this.m_optkey = aidx;
                if ( ('name' === aidx) || ('option' === aidx) ) {
                    ret += this[aidx](cmp.attrs[aidx]);
                } else if ( ('function' === typeof this[aidx]) &&
                            ('toScript' !== aidx) &&
                            ('gencnf' !== aidx) &&
                            ('_' !== aidx[0]) ) {
                    ret += aidx + ":" + this[aidx](cmp.attrs[aidx]);
                } else {
                    if ('template' === aidx) {
                        continue;
                    }
                    ret += aidx + ':' + this._otheropt(cmp.attrs[aidx]);
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
            this.add(cmp.name + ".option(" + this._optgen(cmp) + ");");
            for (let cidx in cmp.child) {
                this.toScript(cmp.child[cidx]);
            }
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
