/**
 * @file Component.js
 * @brief template script generator
 *        this scope is declare, child, option.
 * @author simparts
 */
const fs         = require('fs');
const minify     = require('minify');
const tryToCatch = require('try-to-catch');
const Base       = require('./base/BaseGen.js');
const Declare    = require('./base/Declare.js');
const Module     = require('./module/Module.js');
const Config     = require('./module/Config.js');

module.exports = class extends Module {
    
    constructor (prm, cnf) {
        try {
            super(prm);
            this.gencnf().comment = "template";
            this.gencnf(cnf);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    getTemplate (prm) {
        try {
            let chk_cmp = prm;
	    while (chk_cmp.parent) {
                if ("template" === chk_cmp.parent.tag) {
		    return chk_cmp.parent;
                }
		chk_cmp = chk_cmp.parent;
	    }
	    throw new Error("could not find template parent.'$' prefix can use only in the template tag.");
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

    chkParam (prm) {
        try {
            let chd = prm.child;
            for (let cidx in chd) {
                this.chkParam(chd[cidx]);
	    }
            
            let conv = (c) => {
                try {
		    let buf = null;
                    if ( ("string" === typeof c) && ("$" === c[0]) ) {
		        let tmpl = this.getTemplate(prm);
                        return "@" + tmpl.attrs.name + "_p." + c.substring(1);
		    } else if (("object" !== typeof c) || (null === c)) {
                        return null;
                    } else if (true === Array.isArray(c)) {
		        for (let arr_idx in c) {
                            buf = conv(c[arr_idx]);
			    c[arr_idx] = (null !== buf) ? buf : c[arr_idx]; 
                        }
		    } else if (undefined !== c.constructor) {
                        if ( ("ConfArg" === c.constructor.name) ||
			     ("FuncList" === c.constructor.name) ||
                             ("ModValue" === c.constructor.name) ) {
                            let cval = c.value();
			    for (let cval_idx in cval) {
                                buf = conv(cval[cval_idx]);
				cval[cval_idx] = (null !== buf) ? buf : cval[cval_idx];
			    }
			}
		    } else if (undefined !== c.text) {
                        buf = conv(c.text);
                        c.text = (null !== buf) ? buf : c.text;
                    }
                    return null;
		} catch (e) {
                    console.error(e.stack);
                    throw e;
		}
	    }
            
	    let cret = null;
	    /* check attributes */
	    for (let aidx in prm.attrs) {

	        cret = conv(prm.attrs[aidx]);
                if ("string" === typeof cret) {
                    prm.attrs[aidx] = cret;

		}
	    }

            /* check text */
	    cret = conv(prm.text);
	    if ("string" === typeof cret) {
                prm.text = cret;
	    }
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    declare (prm, bsnm, chd) {
        try {
	    let nm_buf = [];
            for (let pidx in prm) {
                nm_buf.push(prm[pidx].attrs.name);
		prm[pidx].attrs.name = undefined;
            }
            
            super.declare(prm, bsnm, chd);
            
	    for (let pidx2 in prm) {
                prm[pidx2].attrs.name = nm_buf[pidx2];
		if (undefined == prm[pidx2].attrs.name) {
                    delete prm[pidx2].attrs.name;
		}
            }

	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }

    toScript () {
        try {
	    let ret = "";
            let prm = this.param();

            for (let pidx in prm) {
                this.chkParam(prm[pidx]);
                
                this.add("let " + prm[pidx].attrs.name + "=("+ prm[pidx].attrs.name +"_p)=>{");
                
                /* set name component */
		for (let cidx in prm[pidx].child) {
                    prm[pidx].child[cidx].name = "tpl" + cidx;
		}

                this.declare(prm[pidx].child);

		let ret_str = "return [";
		for (let pidx2 in prm[pidx].child) {
                    this.child(prm[pidx].child[pidx2]);
                    this.config(prm[pidx].child[pidx2]);

		    ret_str += prm[pidx].child[pidx2].name + ",";
                }
                
                this.add(ret_str.substring(0,ret_str.length-1) + "];" + "};");
                
		ret = "    ";
		let sp_scp = this.m_script.split("\n");
                for (let sp_idx in sp_scp) {

		    let sp_idx2=0;
                    for (; sp_idx2 < sp_scp[sp_idx].length ;sp_idx2++) {
                        if (" " !== sp_scp[sp_idx][sp_idx2]) {
                            break;
			}
		    }
		    ret += sp_scp[sp_idx].substring(sp_idx2);
                    
		}
	    }
            
	    return "    /* template */\n" + ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
