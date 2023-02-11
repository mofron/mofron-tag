/**
 * @file sort.js
 * 
 */
const fs   = require("fs");
const path = require('path');
const FuncList = require('./tdata/FuncList.js');
const Module   = require('./tdata/ModValue.js');
const ConfArg  = require('./tdata/ConfArg.js');
const Type     = require('./tdata/Type.js');
const attrs    = require('./attrs.js');
const util     = require('../util.js');

let req = null;
let child = async (cmp) => {
    try {
        /* check attrs value */
	for (let aidx in cmp.attrs) {
	    let atr_val = cmp.attrs[aidx];
	    /* check module specified */
	    if (('string' !== typeof atr_val) || (-1 === atr_val.indexOf(':'))) {
                continue;
	    }
	    let mod_nm = atr_val.substring(0, atr_val.indexOf(':'));
            if (true === req.isExists(mod_nm)) {
	        let mod_val = '';
	        if ('' !== atr_val) {
                    mod_val = attrs.rawval2type(atr_val.substr(atr_val.indexOf(':')+1));
		}
                /* attrs value is module */
		cmp.attrs[aidx] = new Module(mod_nm, mod_val);
	    }
	}
        
        if (0 === cmp.tag.indexOf("mfLoad")) {
	    for (let load_idx in global.parse.component) {
                if ("mfLoad" !== global.parse.component[load_idx].tag) {
                    continue;
		} else if (cmp.text !== global.parse.component[load_idx].text) {
                    continue;
		}
		load(cmp, load_idx);
                break;
	    }
            return;
	}

        for (let chd_idx=0; chd_idx < cmp.child.length ; chd_idx++) {
	    /* check child tag name */
	    let chd_tag = cmp.child[chd_idx].tag;
            if ( (null !== cmp.child[chd_idx].parent) &&
	         ("theme" === cmp.child[chd_idx].parent.tag) ) {
//                continue;
	    } else if (0 === chd_tag.indexOf("mfLoad")) {
                load(cmp.child[chd_idx],chd_idx);
                continue;
	    } else if ("mfType" === chd_tag) {
                cmp.child[chd_idx] = new Type(cmp.child[chd_idx].text);
		continue;
	    }
            
	    if ( (false === req.isExists(chd_tag)) && ("div" !== chd_tag) ) {
                
                /* this child is attrs, move to attrs */
                child(cmp.child[chd_idx]);
                let set_val = null;
		if (null !== cmp.child[chd_idx].text) {
                    set_val = cmp.child[chd_idx].text;
		} else if (1 === cmp.child[chd_idx].child.length) {
		    set_val = cmp.child[chd_idx].child[0];
		} else if (1 < cmp.child[chd_idx].child.length) {
                    set_val = cmp.child[chd_idx].child;
		} else {
		    set_val = null;
		}
                
                if (0 !== Object.keys(cmp.child[chd_idx].attrs).length) {
                    if (null === set_val) {
                        set_val = cmp.child[chd_idx].attrs;
		    } else {
                        set_val = new ConfArg([set_val, cmp.child[chd_idx].attrs]);
		    }
		}
		let tag_atr = cmp.attrs[chd_tag];
                if (undefined !== tag_atr) {
		    if (true === util.isObjType(tag_atr,"FuncList")) {
		        /* add function list */
		        tag_atr.addValue(set_val);
		    } else {
		        if (false === Array.isArray(cmp.attrs[chd_tag])) {
                            cmp.attrs[chd_tag] = [cmp.attrs[chd_tag]];
			}
		        cmp.attrs[chd_tag].push(set_val);
		    }
		} else {
                    /* set attrs */
                    if ((true === is_redund(cmp,chd_tag)) && (true === req.isExists(cmp.tag))) {
                        cmp.attrs[chd_tag] = new FuncList(set_val,cmp,chd_tag);
		    } else {
			cmp.attrs[chd_tag] = set_val;
		    }
		}
                cmp.child.splice(chd_idx, 1);
                
		chd_idx--;
            } else {
	        child(cmp.child[chd_idx]);
            }
        }
    } catch (e) {
        console.error(e.stack);
	throw e;
    }
}

let load = (prm,cidx) => {
    try {
        let pnt = prm.parent;
        global.load++;

        fs.readFile(path.dirname(global.mfpath) + "/" + prm.text, 'utf8',
            (err,load_ret) => {
                try {
                    if (undefined === load_ret) {
                        throw new Error("read file is failed:" + prm.text);
                    }
		    /* replace separated components */
                    let spl_tgt = (null !== pnt) ? pnt.child : global.parse.component;
                    //spl_tgt.splice(parseInt(cidx), 1);
		    
		    if ("text" === prm.attrs.type) {
                        spl_tgt.splice(parseInt(cidx), 1);
			pnt.text = load_ret.substring(0, load_ret.length-1);
			global.load--;
			if (0 === global.load) {
                            g_resolve();
                        }
                        return;
                    }
                    
                    new global.Parse(load_ret).parse().then(
                        parse => {
       	                    for (let sidx in parse.script) {
			        if ("extern" === parse.script[sidx].attrs.run) {
	                            /* set parent */
                                    parse.script[sidx].parent = pnt.child[cidx];
	                        }
	                    }
			    /* replace separated components */
                            spl_tgt.splice(parseInt(cidx), 1);
                            for (let rep_idx in parse.component) {
                                /* set parent */
                                parse.component[rep_idx].parent = pnt;
                                child(parse.component[rep_idx]);
                                spl_tgt.splice(parseInt(cidx) + parseInt(rep_idx), 0, parse.component[rep_idx]);
                            }
                            
                            /* set template */
			    for (let tmp_idx in parse.template) {
			        global.parse.template.push(parse.template[tmp_idx]);
			    }
                            
                            global.load--;
                            if (0 === global.load) {
                                g_resolve();
                            }
			}
		    );
                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            }
        );
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

let is_redund = (cmp,aidx) => {
    try {
        let hit = 0;
        for (let chd_idx=0; chd_idx < cmp.child.length ; chd_idx++) {
	    /* check child tag name */
            if (aidx === cmp.child[chd_idx].tag) {
                hit++;
            }
	}
	return (1 < hit) ? true : false;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
};


let g_resolve = null;
module.exports = (prm) => {
    try {
        return new Promise(rsl => {
            g_resolve = rsl;
	    
            req = global.parse.setting.require;   //prm.setting.require;
            for (let pidx in prm) {
                child(prm[pidx]);
            }
	    if (0 === global.load) {
                rsl();
	    }
	});
    } catch (e) {
        console.error(e.stack);
	throw e;
    }
}
/* end of file */
