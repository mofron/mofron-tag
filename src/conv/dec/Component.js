/**
 * @file Component.js
 * @brief declare component generator
 * @author simparts
 */
const Declare = require('./Declare.js');
const util   = require('../../util.js');

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
    
    toScript (prm, chd) {
        try {
            /* set name */
            if ((undefined !== prm.attrs.name) && ('@' !== prm.attrs.name[0])) {
                this.gencnf().name = prm.attrs.name;
                prm.name = prm.attrs.name;
            } else if (false === prm.src) {
                prm.name = this.gencnf().bsnm + (this.gencnf().count+1);
            } else {
                this.gencnf().name = prm.tag;
                prm.name = prm.tag;
            }
            
            if (false === prm.src) {
                /* set value */
                let val = "new ";
                //val += ('Component' === prm.tag) ? 'mf.' : '';
                val += prm.tag;
                //if ((undefined !== prm.text) && (null !== prm.text)) {
                //    let simprm = "";
                //    if ('@' === prm.text[0]) {
                //        simprm = prm.text.substring(1);
                //    } else {
                //        simprm = (true === util.isComment(prm.text)) ? prm.text : '"' + prm.text +'"';
                //    }
                //    val += "(" + simprm + ");";
                //} else {
                    val += "();";
                //}
                super.toScript(val);

                /* genelate child component */
                if (0 !== prm.child.length) {
                    for (let ch_idx in prm.child) {
                        this.toScript(prm.child[ch_idx], true);
                    }
                }
            } else {
                this.add(this.gencnf().cmpgen.srcTag(prm.child.component, prm.tag), 0);
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
