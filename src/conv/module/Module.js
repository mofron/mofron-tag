/**
 * @file Component.js
 * @brief component script generator
 *        ganerate declare, child, and config code.
 * @author simparts
 */
const Base    = require('../base/BaseGen.js');
const util    = require('../../util.js');

module.exports = class extends Base {
    
    constructor (prm, cnf) {
        try {
            super(prm);
            
            /* default config */
            this.gencnf().comment = "component";

            /* set config */
            this.gencnf(cnf);

	    if (undefined !== prm) {
	        this.load();
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    declare (prm, bsnm) {
        try {
	    for (let pidx in prm) {
                let dec = new global.gen.Declare("");
	        let buf = "";

	        if (undefined !== prm[pidx].attrs.name) {
		    dec.gencnf().name = prm[pidx].attrs.name;
		} else if (undefined !== prm[pidx].name) {
                    dec.gencnf().name = prm[pidx].name;
		} else {
                    dec.gencnf().name = global.req.getType(prm[pidx].tag) + global.mod.count++;
		}
                
		let tag = ("div" === prm[pidx].tag) ? "mofron.class.Component" : prm[pidx].tag;
		if (null !== prm[pidx].text) {
                    dec.value("new " + tag + "("+ util.getParam(prm[pidx].text) +");");
		} else {
	            dec.value("new " + tag + "();");
		}
	        prm[pidx].name = dec.name();
                
		/* child component declare */
		if (0 !== prm[pidx].child.length) {
                    this.declare(prm[pidx].child, prm[pidx].name + "_");
		}
                global.mod.dec.push(dec.toScript());
	    }
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }

    child (prm) {
        try {
            if (0 === prm.child.length) {
                return;
	    }
	    let buf = "";
	    for (let chd_idx in prm.child) {
                this.child(prm.child[chd_idx]);
                buf += prm.child[chd_idx].name + ",";
	    }
	    buf = buf.substring(0, buf.length-1);
	    global.mod.child.push("    " + buf);
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
    
    config (prm) {
        try {
            for (let chd_idx in prm.child) {
                this.config(prm.child[chd_idx]);
	    }
	    let buf = new global.gen.Config(prm, { defidt:0 }).toScript();
	    global.mod.conf.push("    " + buf);
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }

    load () {
        try {
	    super.toScript();
            let prm = this.param();
            
	    /* declare */
	    this.declare(prm);
            
	    for (let pidx in prm) {
                /* child */
                this.child(prm[pidx]);
		
	        /* config */
		this.config(prm[pidx]);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    toScript () {
        try {
	    let ret = "";
            for (let didx in global.mod.dec) {
                ret += global.mod.dec[didx];
            }

	    for (let chd_idx in global.mod.child) {
                ret += global.mod.child[chd_idx];
	    }

	    for (let cnf_idx in global.mod.conf) {
                ret += global.mod.conf[cnf_idx]
	    }

	    return ret;
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }
}
/* end of file */
