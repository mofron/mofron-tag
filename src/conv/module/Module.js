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
    
    declare (prm, bsnm, chd) {
        try {
	    for (let pidx in prm) {
                let dec = new global.gen.Declare("");
	        let buf = "";
                
	        if (undefined !== prm[pidx].attrs.name) {
		    dec.gencnf().name = prm[pidx].attrs.name;
		} else if (undefined !== prm[pidx].name) {
                    dec.gencnf().name = prm[pidx].name;
		} else if (undefined !== bsnm) {
		    dec.gencnf().name = bsnm + prm[pidx].parent.cmp_cnt++;
		} else {
		    let set_name = ("div" === prm[pidx].tag) ? "cmp" : global.req.getType(prm[pidx].tag);
                    dec.gencnf().name = set_name + global.mod.count++;
		}
                
		let tag     = ("div" === prm[pidx].tag) ? "mofron.class.Component" : prm[pidx].tag;
		let set_val = "new " + tag + "(";
		if (null !== prm[pidx].text) {
		    if ( ("object" === typeof prm[pidx].text) &&
		         ("ConfArg" === prm[pidx].text.constructor.name) ) {
                        let cnf_val = prm[pidx].text.value();
			for (let cv_idx in cnf_val) {
                            set_val += util.getParam(cnf_val[cv_idx]) + ",";
			}
			set_val = set_val.substring(0, set_val.length-1);
                    } else {
                        set_val += util.getParam(prm[pidx].text)
		    }
		}
                dec.value(set_val + ");");
	        prm[pidx].name = dec.name();
                
		/* child component declare */
		if (0 !== prm[pidx].child.length) {
                    this.declare(prm[pidx].child, prm[pidx].name + "_", true);
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
	    let ret = prm.name + ".child([";
	    for (let chd_idx in prm.child) {
                this.child(prm.child[chd_idx]);
                ret += prm.child[chd_idx].name + ",";
	    }
	    ret = ret.substring(0, ret.length-1);
	    global.mod.child.unshift("    " + ret + "]);\n");
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
	    if (-1 === buf.indexOf(".config({});")) {
                global.mod.conf.push("    " + buf);
	    }
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
