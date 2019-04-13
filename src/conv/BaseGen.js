/**
 * @file BaseGen.js
 * @brief base generator
 * @author simparts
 */

module.exports = class {
    constructor (opt) {
        try {
            this.m_gencnf = {
                minify: false
            };
            this.gencnf(opt);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    gencnf (prm) {
        try {
            if (undefined === prm) {
                /* getter */
                return this.m_gencnf;
            }
            for (let pidx in prm) {
                this.m_gencnf[pidx] = prm[pidx];
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    toScript () { /* interface */ }
}
/* end of file */
