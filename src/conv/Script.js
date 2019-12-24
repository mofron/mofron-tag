/**
 * @file Script.js
 * @brief script generator
 * @author simparts
 */
const Base    = require('./base/BaseGen.js');
const Declare = require('./base/Declare.js');
const util    = require('../util.js');
const fs      = require('fs');

module.exports = class extends Base {
    
    constructor (prm, cnf) {
        try {
            super(prm);
	    //if (undefined === cnf.type) {
            //    cnf.type = "before";
	    //}
	    //this.gencnf().comment = "script (" + cnf.type + ")";
            //if ("after" === cnf.type) {
            //    this.gencnf().defidt = 2;
	    //}
            this.gencnf(cnf);


        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    loadSrc (prm) {
        try {
	    let prm      = this.param();
	    let scp_obj  = this;
            let read_fnc = (err,tag) => {
                try {
                    if (undefined === tag) {
                        throw new Error("load script is failed:" + prm[pidx].attrs.src);
                    }
                    prm.text = tag;
                    //delete prm.attrs.src;

                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            }
            for (let pidx in prm) {
                if (undefined !== prm[pidx].attrs.src) {
                    let src = prm.attrs.src;
		    fs.readFile(process.cwd() + '/' + src.substring(1, src.length-1), 'utf8', read_fnc);
		}
	    }
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }
    
    toScript () {
        try {
	    this.m_script = "";
	    let prm  = this.param();
	    let type = this.gencnf().type;
            if (undefined === type) {
                type = "before";
	    } else if ("after" === type) {
	        this.gencnf().defidt = 2;
            }
            this.gencnf().comment = "script (" + type + ")";
	    super.toScript();
            
            for (let pidx in prm) {
                if ( (type !== prm[pidx].attrs.run) &&
		     !((undefined === prm[pidx].attrs.run) && ("before" === type)) ) {
		    /* not matched type, skip */
                    continue;
		}
                
		if (undefined !== prm[pidx].attrs.name) {
                    /* create function parameter */
                    let scp_prm = "";
                    if (true === Array.isArray(prm[pidx].attrs.param)) {
                        for (let pidx2 in prm.attrs.param) {
                            scp_prm += prm[pidx].attrs.param[pidx2] + ',';
                        }
                    } else {
                        /* set default parameter name */
                        scp_prm += prm[pidx].attrs.name + '1,' + prm[pidx].attrs.name + '2,' + prm[pid].attrs.name + '3';
                    }
		    /* declare function */
		    let dec_opt = { name: prm[pid].attrs.name };
                    this.add(
		        new Declare(dec_opt).toScript("(" + scp_prm + ")=>{")
		    );
                }
                /* set contents */

		//console.log(prm[pidx]);

                let sp_txt = prm[pidx].text.split(';');
                for (let sp_idx in sp_txt) {
		    if ( (sp_idx == sp_txt.length-1) &&
		         ('' == sp_txt[sp_idx]) ) {
                        break;
		    }
                    this.add(sp_txt[sp_idx] + ';');
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
