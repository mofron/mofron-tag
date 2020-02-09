/**
 * @file Component.js
 * @brief component script generator
 *        ganerate declare, child, and config code.
 * @author simparts
 */
const Base    = require('../base/BaseGen.js');
const Declare = require('../base/Declare.js');
const Config  = require('./Config.js');
const util    = require('../../util.js');

module.exports = class extends Base {
    
    constructor (prm, cnf) {
        try {
            super(prm);
            
            /* default config */
            this.gencnf().comment = "component";
            this.gencnf().config  = Config;

            /* set config */
            this.gencnf(cnf);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    declare (prm, bsnm) {
        try {
            let dec = new Declare("", { defidt:0 });
            if (undefined !== bsnm) {
	        dec.gencnf().bsnm = bsnm;
            } else if (undefined !== this.gencnf().bsnm) {
                dec.gencnf().bsnm = this.gencnf().bsnm;
	    } else {
                dec.gencnf().bsnm = "cmp";
	    }

	    let buf = "";
	    for (let pidx in prm) {
                
	        if (undefined !== prm[pidx].attrs.name) {
		    dec.gencnf().name = prm[pidx].attrs.name;
		}
                
		let tag = ("div" === prm[pidx].tag) ? "mofron.class.Component" : prm[pidx].tag;
		if (null !== prm[pidx].text) {
                    dec.value("new " + tag + "("+ util.getParam(prm[pidx].text) +");");
		} else {
	            dec.value("new " + tag + "();");
		}
	        prm[pidx].name = dec.name();
                
                buf = dec.toScript();
	        this.add(buf.substring(0, buf.length-1));
                
		/* child component declare */
                this.declare(prm[pidx].child, prm[pidx].name + "_")
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
	    this.add(prm.name + ".child([" + buf + "]);");
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
            //let Config = this.gencnf().config;
	    let buf = new Config(prm, { defidt:0 }).toScript();
            this.add(buf.substring(0, buf.length-1));
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }

    toScript () {
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
	    
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
