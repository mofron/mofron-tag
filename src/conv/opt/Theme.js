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
            this.add("{");
            let buf     = "";
            let thm_cnt = null;
            for (let pidx in prm.child) {
                if (undefined === prm.child[pidx].target) {
                    /* replace type is option */
                    buf += prm.child[pidx].tag + ':';
                    this.gencnf().optgen.gencnf().theme = true;
                    buf += this.gencnf().optgen._optgen(prm.child[pidx]);
                    this.gencnf().optgen.gencnf().theme = false;
                } else {
                    buf += prm.child[pidx].target + ':';
                    delete prm.child[pidx].target;

                    if (1 > Object.keys(prm.child[pidx]).length) {
                        /* replace type is class */
                        buf += prm.child[pidx].tag;
                    } else {
                        /* replace type is class with option */
                        buf += '[' + prm.child[pidx].tag + ',';
                        this.gencnf().optgen.gencnf().theme = true;
                        buf += '{' + this.gencnf().optgen._optgen(prm.child[pidx]) + '}]';
                        this.gencnf().optgen.gencnf().theme = false;
                    }
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
