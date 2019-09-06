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
            if (undefined !== scp.attrs.name) {
                let prm = ("string" === typeof scp.attrs.param) ? scp.attrs.param : "";
                if (true === Array.isArray(scp.attrs.param)) {
                    for (let pidx in scp.attrs.param) {
                        //console.log(scp.attrs.param);
                        prm += scp.attrs.param[pidx] + ',';
                    }
                    prm = prm.substring(0, prm.length-1);
                }
                this.add("let " + scp.attrs.name + "=("+ prm +")=>{try{");
                let sp_txt = scp.text.split(';');
		for (let sp_idx in sp_txt) {
                    this.add(sp_txt[sp_idx] + ";");
		}
		this.add("}catch(e){console.error(e.stack);throw e;}"+ "};");
            } else {
                this.add(scp.text);
            }
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
