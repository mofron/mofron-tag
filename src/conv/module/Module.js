/**
 * @file Module.js
 * @brief component script generator
 *        ganerate declare, child, and config code.
 * @license MIT
 */
const Base = require('../base/BaseGen.js');
const util = require('../../util.js');

module.exports = class extends Base {
    
    constructor (prm, cnf) {
        try {
            super(prm);
            /* default config */
            this.gencnf().comment = "component";
            /* set config */
            this.gencnf(cnf);
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
		        if (("object" === typeof prm[pidx].text) && ("mfLoad" === prm[pidx].text.tag)) {
			    let sp_load = prm[pidx].text.load.split("\n");
			    set_val += ("double" !== prm[pidx].text.attrs.comment) ? "'" : '"';
			    for (let sp_idx in sp_load) {
                                set_val += sp_load[sp_idx] + "\\n";
			    }
			    set_val += "'";
			} else {
                            set_val += util.getParam(prm[pidx].text)
			}
		    }
		}
                dec.value(set_val + ");");
	        prm[pidx].name = dec.name();
                
		/* child component declare */
		if (0 !== prm[pidx].child.length) {
                    this.declare(
		        prm[pidx].child,
			("root_cmp" === prm[pidx].name) ? undefined : prm[pidx].name + "_",
			true
                    );
		}
		let set = dec.toScript();
                
		if (true === this.gencnf().addglo) {
		    global.module.add(set.substring(4, set.length-1));
		} else {
                    this.add(set.substring(4, set.length-1));
                }
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
	    let script = prm.name + ".child([";
	    for (let chd_idx in prm.child) {
                this.child(prm.child[chd_idx]);

                if (true === prm.child[chd_idx].attrs.mfDefinition) {
                    /* this tag is only definition */
		    if (1 === prm.child.length) {
                        return;
		    }
                    continue;
		}

                script += prm.child[chd_idx].name + ",";
	    }
	    script = script.substring(0, script.length-1) + "]);";
	    if (true === this.gencnf().addglo) {
	        global.module.add(script);
            } else {
                this.add(script);
            }
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

	    let buf = new global.gen.Config(prm, { defidt:0, module: this }).toScript();
	    if (-1 === buf.indexOf(".config({});")) {
	        if (true === this.gencnf().addglo) {
                    global.module.add(buf.substring(0, buf.length-1));
		} else {
	            this.add(buf.substring(0, buf.length-1));
		}
	    }
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
    
    
    
    toScript (p) {
        try {
	    let prm = null;
            if (undefined !== p) {
	        prm = p;
            } else {
	        super.toScript();
	        prm = this.param();
            }
	    /* declare */
	    this.declare(prm);
            
	    for (let pidx in prm) {
                /* child */
                this.child(prm[pidx]);
	        /* config */
		this.config(prm[pidx]);
            }
            if (true !== this.gencnf().addglo) {
	        return this.m_script;
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
