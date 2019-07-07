/**
 * @file Options.js
 * @brief option script generator
 * @author simparts
 */
const Base   = require('./BaseGen.js');
const Style  = require('./opt/Style.js');
const Theme  = require('./opt/Theme.js');
const Respsv = require('./opt/Respsv.js');
const Color  = require('./opt/Color.js');
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
    
    mainColor (prm) {
        try {
            return new Color({ 
                minify: true,
                autoopt: !this.gencnf().theme
            }).toScript(prm);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    baseColor (prm) {
        try {
            return new Color({
                minify: true,
                autoopt: !this.gencnf().theme
            }).toScript(prm);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    accentColor (prm) {
        try {
            return new Color({
                minify: true,
                autoopt: !this.gencnf().theme
            }).toScript(prm);
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
                     (null !== prm.match(/\w+[(].*[)]/g)) ) {
                    ret += 'new ';
                }
                ret += prm;
            } else if ( ("number" === typeof prm) || ("boolean" === typeof prm) ) {
                ret += prm;
            } else if (true === Array.isArray(prm)) {
                ret += '[';
                for (let vidx in prm) {
                    if ("string" === typeof prm[vidx]) {
                        if ( (false === util.isComment(prm[vidx])) &&
                             ('number' !== typeof prm[vidx]) &&
                             (null !== prm[vidx].match(/\w+[(].*[)]/g)) ) {
                            ret += 'new ';
                        }
                        ret += prm[vidx];
                    } else if ("object" === typeof prm[vidx]) {
                        if ( (0 === prm[vidx].child.length) && (null !== prm[vidx].text) ) {
                            ret += (false === util.isComment(prm[vidx].text)) ? '"' + prm[vidx].text + '"' : prm[vidx].text;
                        } else {
                            ret += this._otheropt(prm[vidx]);
                        }
                    } else {
                        ret += prm[vidx];
                    }
                    ret += ',' ;
                }
                ret = ret.substring(0, ret.length-1);
                ret += ']';
            } else if ('object' === typeof prm) {
                if (0 === prm.child.length) {
                    if ( (null !== prm.text) && (0 < prm.text.length) ) {
                        if (true === this.gencnf().autoComment) {
                            ret += (true === util.isComment(prm.text)) ? prm.text : '"' + prm.text + '"';
                        } else {
                            ret += prm.text;
                        }
                    } else {
                        //delete prm.attrs.option;
                        ret += "new mf.Option(" + this._optgen(prm) + ")";
                    }
                } else {
                    if ("string" === typeof prm.attrs.param) {
                        ret += "new mf.Option({" + prm.attrs.param + ":";
                        if (1 === prm.child.length) {
                            ret += "new " + prm.child[0].tag + "(" + this._optgen(prm.child[0]) + ")";
                        } else {
                            ret += "[";
                            for (let cidx in prm.child) {
                                ret += "new " + prm.child[cidx].tag + "(" + this._optgen(prm.child[cidx]) + "),";
                                //console.log(prm.attrs.param + ":" + this._optgen(prm.child[0]));
                            }
                            ret = ret.substring(0, ret.length-1);
                            ret += "]";
                        }
                        ret += "})";
                        //ret += "new mf.Option(" + this._optgen(prm) + ")";
                    } else {
                        let is_array = false;
                        if (('layout' === prm.tag) || ('event' === prm.tag) || ('effect' === prm.tag)) {
                            ret += "[";
                            is_array = true;
                        } else if (1 < prm.child.length) {
                            ret += "[";
                            is_array = true;
                        }
                        
                        for (let cidx in prm.child) {
                            ret += "new " + prm.child[cidx].tag + "(";
                            if ( (('layout' === prm.tag) || ('event' === prm.tag) || ('effect' === prm.tag)) &&
                                 (null !== prm.child[cidx].text) ) {
                                ret += prm.child[cidx].text;
                                ret += "),";
                            } else {
                                let opt_chd = (0 === prm.child[cidx].child.length) ? undefined : prm.child[cidx].child;
                                ret += this._optgen(prm.child[cidx], opt_chd) + "),";
                            }
                        }
                        ret = ret.substring(0, ret.length-1);
                        if (true === is_array) {
                            ret += "]";
                        }
                    }
                }
            } else {
                throw new Error('unknown attr');
            }
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    _optgen (cmp, ochd) {
        try {
            let ret = "{";
            if ((undefined !== cmp.text) && (null !== cmp.text)) {
                ret += "prmOpt: ";
                let simprm = "";
                if ('@' === cmp.text[0]) {
                    simprm = cmp.text.substring(1);
                } else {
                    simprm = (true === util.isComment(cmp.text)) ? cmp.text : '"' + cmp.text + '"';
                }
                ret += simprm + ",";
            }
            
            if (undefined !== ochd) {
                ret += "child:[";
                for (let oc_idx in ochd) {
                    let oo_chd = (0 === ochd[oc_idx].child.length) ? undefined : ochd[oc_idx].child;
                    ret += "new " + ochd[oc_idx].tag + "("+ this._optgen(ochd[oc_idx], oo_chd) +"),";
                }
                ret = ret.substring(0, ret.length-1);
                ret += "],";
            }
            
            for (let aidx in cmp.attrs) {
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
                    if ( (true === Array.isArray(cmp.attrs[aidx])) &&
                         ("object" === typeof cmp.attrs[aidx][0]) &&
                         (0 < Object.keys(cmp.attrs[aidx][0].attrs).length) ) {
                        let set_atr = {};
                        for (let atr_idx in cmp.attrs[aidx]) {
                            let chk_atr = cmp.attrs[aidx][atr_idx].attrs;
                            for (let chk_idx in chk_atr) {
                                if (undefined === set_atr[chk_idx]) {
                                    set_atr[chk_idx] = [chk_atr[chk_idx]];
                                } else {
                                    set_atr[chk_idx].push(chk_atr[chk_idx]);
                                }
                            }
                        }
                        for (let set_idx in set_atr) {
                            ret += (cmp.attrs[aidx][0].tag + "_" + set_idx) + ':';
                            ret += "[";
                            for (let val_idx in set_atr[set_idx]) {
                                ret += set_atr[set_idx][val_idx] + ",";
                            }
                            ret = ret.substring(0, ret.length-1);
                            ret += "],";
                        }
                        //ret = ret.substring(0, ret.length-1);
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
            if (true === cmp.src) {
                return this.m_script;
            }
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
