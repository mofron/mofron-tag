/**
 * @file Color.js
 * @brief component color method generator
 * @author simparts
 */
const Base = require('../BaseGen.js');
const util = require('../../util.js');

module.exports = class extends Base {
    
    toScript (prm) {
        try {
            let get_clr = (p) => { 
                try {
                    let ret = "";
                    if (true === Array.isArray(p)) {
                        ret += "[";
                        for (let pidx in p) {
                            ret += p[pidx] + ",";
                        }
                        ret = ret.substring(0, ret.length-1);
                        ret += "]";
                    } else if ('string' === typeof p) {
                        ret += p;
                    } else if (('object' === typeof p) && (undefined !== p.text)) {
                        ret += util.getParam(p.text);
                    }
                    return ret;
                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            }
            
            if (true === this.gencnf().autoopt) {
                this.add("[");
                this.add(get_clr(prm));
                this.add(",{locked:true,forced:true}]");
            } else {
                this.add(get_clr(prm));
            }
            
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
