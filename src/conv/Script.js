/**
 * @file Script.js
 * @brief script generator
 * @author simparts
 */
const Base = require('./BaseGen.js');
const util = require('../util.js');

module.exports = class extends Base {
    
    toScript (scp) {
        try {
            for (let sidx in scp) {
                this.add(scp[sidx].text);
            }
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
