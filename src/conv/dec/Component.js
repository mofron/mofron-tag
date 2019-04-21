/**
 * @file Component.js
 * @brief declare component generator
 * @author simparts
 */
const Declare = require('./Declare.js');

let Component = class extends Declare {
    
    constructor (opt) {
        try {
            super(opt);
            this.gencnf().bsnm = ((undefined !== opt) && (undefined !== opt.bsnm)) ? opt.bsnm : "cmp";
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    toScript (prm) {
        try {
            /* set name */
            if ((undefined !== prm.attrs.name) && ('@' !== prm.attrs.name[0])) {
                this.gencnf().name = prm.attrs.name;
                prm.name = prm.attrs.name;
            } else {
                prm.name = this.gencnf().bsnm + (this.gencnf().count+1);
            }
            /* set value */
            let val = "new ";
            val += ('Component' === prm.tag) ? 'mf.' : '';
            val += prm.tag + "();";
            let ret = super.toScript(val);
            
            /* genelate child component */
            if (0 !== prm.child.length) {
                for (let ch_idx in prm.child) {
                    this.toScript(prm.child[ch_idx]);
                }
            }

            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
}
module.exports = Component;
/* end of file */
