/**
 * @file Style.js
 * @brief component style method generator
 * @author simparts
 */
const Base = require('../BaseGen.js');
const util = require('../../util.js');

module.exports = class extends Base {
    
    toScript (prm) {
        try {
            if ('object' === typeof prm) {
                return this.toScript("'" + prm.text + "'");
            } else if ('string' !== typeof prm) {
                throw new Error('invalid parameter');
            }
            prm = prm.substring(1, prm.length-1);
            this.add("[{");
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
            let buf    = "";
            for (let sp_idx in sp_prm) {
                sp_elm = sp_prm[sp_idx].split(':');
                if (2 !== sp_elm.length) {
                    throw new Error('invalid style');
                }
                buf += "'" + sp_elm[0] + "':";
                buf += "'" + sp_elm[1] + "',";
            }
            this.add(buf.substring(0, buf.length-1) + '},{locked:true,forced:true}]');
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
