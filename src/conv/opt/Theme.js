/**
 * @file Theme.js
 * @brief component theme method generator
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
    
    toScript (prm) {
        try {
            let buf = "";
            this.add("{");
            for (let pc_idx in prm.child) {
                let pcv = prm.child[pc_idx]; /* prm.child value */
                
                buf += pcv.tag + ":";
                if (undefined === pcv.attrs.replace) {
                    /* replace type is option */
                    this.gencnf().optgen.gencnf().theme = true;
                    buf += this.gencnf().optgen._optgen(pcv);
                    this.gencnf().optgen.gencnf().theme = false;
                } else if (1 === Object.keys(pcv.attrs).length) {
//                  /* replace type is class */
                    buf += pcv.attrs.replace;
                } else {
                    /* replace type is class with option */
                    buf += '[' + pcv.attrs.replace + ',';
                    delete pcv.attrs.replace;
                    this.gencnf().optgen.gencnf().theme = true;
                    buf += this.gencnf().optgen._optgen(pcv) + ']';
                    this.gencnf().optgen.gencnf().theme = false;
                }
                buf += ",";
            }
            this.add(buf.substring(0, buf.length-1) + '}');
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
