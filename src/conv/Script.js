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
            this.gencnf(cnf);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    getExternal () {
        try {
            let prm  = this.param();
	    let ext  = [];
	    let nmsp = [];
            for (let pidx in prm) {
                if ("external" !== prm[pidx].attrs.run) {
                    continue;
		}
                ext.push(prm[pidx]);
                let nm_hit = false;
		for (let nidx in nmsp) {
                    if (nmsp[nidx] === prm[pidx].parent.attrs.name) {
                        nm_hit = true;
			break;
		    }
		}
		if (false === nm_hit) {
                    nmsp.push(prm[pidx].parent.attrs.name);
		}
	    }
            return [ext, nmsp];
            
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }

    external () {
        try {
            let buf  = this.getExternal();
            let ext  = buf[0];
	    let nmsp = buf[1];
            
            for (let nidx in nmsp) {
	        this.add("let " + nmsp[nidx] + "={");
	        for (let eidx in ext) {

                    if (nmsp[nidx] === ext[eidx].parent.attrs.name) {
		        let code = ext[eidx].text.split("\n");
                        this.add("    " + ext[eidx].attrs.name + ":()=>{");
			for (let cidx=0; cidx < code.length ;cidx++) {
			    this.add(code[cidx],3);
			}
			this.add("},",2);
		    }
		}
		this.add("}");
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

	    if ("external" === type) {
	        this.external();
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
                    /* create function parameter */
                    //let scp_prm = "";
                    //if (true === Array.isArray(prm[pidx].attrs.param)) {
                    //    for (let pidx2 in prm.attrs.param) {
                    //        scp_prm += prm[pidx].attrs.param[pidx2] + ',';
                    //    }
                    //} else {
                    //    ///* set default parameter name */
                    //    //scp_prm += name + '1,' + name + '2,' + name + '3';
                    //}
		    /* declare function */
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
