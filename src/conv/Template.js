/**
 * @file Component.js
 * @brief template script generator
 *        this scope is declare, child, option.
 * @author simparts
 */
const Base      = require('./base/BaseGen.js');
const Declare   = require('./base/Declare.js');
const Component = require('./module/Module.js');
const Config    = require('./module/Config.js');

class TmplOpt extends Config {
    getParam (prm, po) {
        try {
	    if (("string" === typeof prm) && ('@' === prm[0])) {
                prm = ('@' === prm[1]) ? prm.substr(1) : "@p." + prm.substr(1);
	    }
            return super.getParam(prm, po);
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
}

module.exports = class extends Base {
    
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
    
    toScript () {
        try {
            super.toScript();
            let prm = this.param();


            for (let pidx in prm) {
	        
		let cmp = new Component(
		                  prm[pidx].child,
				  {
				      comment : "template component",
				      defidt  :2,
				      bsnm    : prm[pidx].attrs.name,
                                      options : TmplOpt
				  }
                              );
                let tmp_val = "(p)=>{\n" + cmp.toScript();
                //new Component(prs.component).toScript();
	        
                let dec_src = new Declare(
		                  tmp_val,
				  { name: prm[pidx].attrs.name, defidt:0 }
			      ).toScript();
                this.add(dec_src.substring(0,dec_src.length-2));
                
		let ret_str = "return [";
		for (let chd_idx in prm[pidx].child) {
		    ret_str += prm[pidx].child[chd_idx].name + ',';
                }
		ret_str = ret_str.substring(0,ret_str.length-1) + "];"
		this.add(ret_str,2);
		this.add("};");


	    }

	    
            
//            /* return area */
//            let buf = "";
//            buf += "let set_comp=[";
//            for (let cidx4 in cmp_lst) {
//	        if (false === cmp_lst[cidx4].src) {
//                    buf += cmp_lst[cidx4].name + ",";
//		} else {
//		    let src_cmp = cmp_lst[cidx4].child.component;
//		    for (let cidx5 in src_cmp) {
//                        buf += src_cmp[cidx5].name + ",";
//                    }
//		    buf = buf.substring(0, buf.length-1);
//		}
//            }
//	    if (',' === buf[buf.length-1]) {
//                buf = buf.substring(0, buf.length-1);
//	    }
//            buf += "];";
//            this.add(buf);
            
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
