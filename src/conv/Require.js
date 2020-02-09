/**
 * @file Require.js
 * @brief module declare genelator
 * @author simparts
 */
const Base = require('./base/BaseGen.js');
const util = require('../util.js');

module.exports = class extends Base {
    
    constructor (prm, cnf) {
        try {
            super(prm);
            
	    this.gencnf().defidt  = 0;
            this.gencnf().comment = "require";

            /* set config */
            this.gencnf(cnf);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    toScript () {
        try {
	    super.toScript();

	    this.add("require('expose-loader?app!../conf/namesp.js');",0);
	    this.add("require('mofron');",0);

	    let prm = this.param();

            for (let pidx in prm) {
                let line = "const " + prm[pidx].text + "=require(";
                if (true === util.isComment(prm[pidx].attrs.load)) {
                    line += prm[pidx].attrs.load + ");";
                } else {
                    line += "'" + prm[pidx].attrs.load + "');";
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
