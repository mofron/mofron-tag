/**
 * @file Respsv.js
 * @brief component respsv generator
 * @author simparts
 */
const Base = require('../BaseGen.js');
const util = require('../../util.js');

module.exports = class extends Base {
    
    constructor (opt, gen) {
        try {
            opt.optgen = gen;
            super(opt);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    typeString (prm) {
        try {
            if (0 === Object.keys(prm).length) {
                return "{}";
            }
            let ret = "{";
            for (let pidx in prm) {
                ret += pidx + ":";
                ret += (true === util.isComment(prm[pidx])) ? prm[pidx] : '"' + prm[pidx]+ '"';
                ret += ",";
            }
            return ret.substring(0, ret.length-1) + "}";
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    toScript (prm) {
        try {
            this.add("{");
            
            
            let res_elm = prm.attrs;
            for (let elm in res_elm) {
                let txt_atr = {};
                for (let elm_atr in res_elm[elm].attrs) {
                    if ('string' === typeof res_elm[elm].attrs[elm_atr]) {
                        txt_atr[elm_atr] = res_elm[elm].attrs[elm_atr];
                        delete res_elm[elm].attrs[elm_atr];
                    }
                }
                
                this.add(elm + ":");
                this.add("[");
                this.add(this.typeString(txt_atr) + ",");
                this.add(this.gencnf().optgen._optgen(res_elm[elm]));
                let keys = Object.keys(res_elm);
                this.add("]" + ((elm != keys[keys.length-1]) ? "," : ""));
            }
            
            this.add("}");
            
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
