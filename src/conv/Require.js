/**
 * @file Require.js
 * @brief module declare genelator
 * @author simparts
 */
const Base = require('./BaseGen.js');
const util = require('../util.js');

module.exports = class extends Base {
    
    toScript (prm) {
        try {
            this.add("const mf=require('mofron');",0);
            for (let pidx in prm) {
                
                let line = "const " + prm[pidx].text + "=require(";
                if (true === util.isComment(prm[pidx].attrs.module)) {
                    line += prm[pidx].attrs.module + ");";
                } else {
                    line += "'" + prm[pidx].attrs.module + "');";
                }
                this.add(line, 0);
            }
            
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
