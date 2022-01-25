/**
 * @file Script.js
 * @brief script generator
 * @author simparts
 */
const minify      = require('minify');
const tryToCatch  = require('try-to-catch');
const fs      = require('fs');
const Base    = require('./base/BaseGen.js');
const Declare = require('./base/Declare.js');
const util    = require('../util.js');


module.exports = class extends Base {
    
    constructor (prm, cnf) {
        try {
            super(prm);
            this.gencnf(cnf);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    async extern () {
        try {
            let prm = this.param();
	    for (let pidx in prm) {
                if ("extern" !== prm[pidx].attrs.run) {
                    continue;
		}
                let code = prm[pidx].text.split("\n");

		//let set_code = "";
		for (let cidx in code) {
		    if (0 == cidx) {
                        this.add("let " + prm[pidx].attrs.name + "=" + code[cidx]);
		    } else {
                        this.add(code[cidx]);
		    }
                //    set_code += code[cidx];
		}
                //this.add("let " + prm[pidx].attrs.name + "=" + set_code);
	    }
	} catch (e) {
	    console.error(e.stack);
            throw e;
	}
    }
    
    toScript (tp) {
        try {
	    this.m_script = "";
	    let prm  = this.param();
	    let type = (undefined === tp) ? this.gencnf().type : tp;
            if (undefined === type) {
                type = "before";
	    } else if ("after" === type) {
	        this.gencnf().defidt = 2;
            }
            this.gencnf().comment = "script (" + type + ")";
	    super.toScript();

	    if ("extern" === type) {
	        this.extern();
                return this.m_script;
	    }
            
            for (let pidx in prm) {
	        let name = prm[pidx].attrs.name;
                if ( (type !== prm[pidx].attrs.run) &&
		     !((undefined === prm[pidx].attrs.run) && ("before" === type)) ) {
		    /* not matched type, skip */
                    continue;
		}
                
		if (undefined !== name) {
		    this.add("let " + name + "= () => {");
                }
                /* set contents */
		let sp_txt = prm[pidx].text.split('\n');
		for (let sp_idx in sp_txt) {
                    this.add(sp_txt[sp_idx], (undefined !== name) ? 2 : undefined);
                }
		if (undefined !== name) {
                    this.add("}");
		}
	    }
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
