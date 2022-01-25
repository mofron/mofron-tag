/**
 * @file ./Parser.js
 * @brief tag perse controller for mofron
 *        read tag file, sort some objects for converver
 * @author simparts
 */
const fs          = require('fs')
const minify      = require('minify');
const tryToCatch  = require('try-to-catch');
const html_parser = require('node-html-parser');
const Require     = require('./Require.js');
const mftree      = require('./tree.js');
const util        = require('../util.js');
const Separate    = require('./tdata/Separate.js');

module.exports = class {
    
    constructor (txt) {
        try {
	    this.m_tagtxt = txt;
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }

    getret () {
        return this.m_return;
    }

    searchsep (sep_nm, comp) {
        try {
	    if (undefined === comp) {
	        comp = this.m_return.component;
	    }
            for (let cidx in comp) {
                if (sep_nm === comp[cidx].tag) {
		    return comp[cidx];
		}
		let ret = this.searchsep(sep_nm, comp[cidx].child);
		if (undefined !== ret) {
                    return ret;
		}
	    }
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

    repsep (sep_nm, sep_cmp) {
        try {
            let tgt = this.searchsep(sep_nm);
	    let rep_tgt = null;
	    if (null === tgt.parent) {
                rep_tgt = this.getret().component;
	    } else {
	        rep_tgt = tgt.parent.child;
		for (let sep_idx in sep_cmp) {
                   sep_cmp[sep_idx].parent = tgt.parent;
		}
	    }

	    /* replace */
	    for (let ridx in rep_tgt) {
                if (sep_nm === rep_tgt[ridx].tag) {
                    rep_tgt.splice(parseInt(ridx),1);
		    for (let sidx in sep_cmp) {
                        rep_tgt.splice(parseInt(ridx), 0, sep_cmp[sidx]);
		    }
		}
	    }
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }
    
    async parse () {
        try {
            let load_script = (src) => {
                return new Promise(resolve => {
                    fs.readFile(
		        src,
			'utf8',
                        (err,scp) => { resolve(scp); }
                    );
                });
	    };
            
            
            this.m_return = this.convprs(this.m_tagtxt);
	    let prs_obj   = this;
            /* load script contents that are separated file */
	    for (let sidx in this.m_return.script) {
	        let scp = this.m_return.script[sidx];
	        if (undefined !== scp.attrs.src) {
		    if (true === util.isComment(scp.attrs.src)) {
		        scp.attrs.src = scp.attrs.src.substring(1, scp.attrs.src.length-1);
                    }
		    //const [error, data] = await tryToCatch(minify, scp.attrs.src);
 		    //if (error) {
                    //    throw new Error(error);
 		    //}
     		    //scp.text = data;
                    scp.text = await load_script(scp.attrs.src);
		} 
            }
            /* set gloabal area */
            if (null === global.parse) {
                global.parse = this.m_return;
	    } else {
                this.addResult();
	    }
            return this.m_return;
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

    addResult () {
        try {
            /* add module */
            let mod = this.m_return.setting.require.module();
            for (let midx in mod) {
                global.parse.setting.require.module(mod[midx]);
            }
            
            /* add template */
	    let tmpl = this.m_return.setting.template;
            for (let tidx in tmpl) {
	        global.parse.template.push(tmpl[tidx]);
            }
            
            /* add script */
            let scp = this.m_return.script;
            for (let sidx in scp) {
		global.parse.script.push(scp[sidx]);
            }
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

    repcomp (tname, chk_cmp, rep_cmp) {
        try {
            for (let chk_idx in chk_cmp) {
                this.repcomp(tname, chk_cmp[chk_idx].child, rep_cmp);
                
                if (tname === chk_cmp[chk_idx].tag) {
                    /* replace component */
		    chk_cmp.splice(chk_idx, 1);
                    for (let cidx=rep_cmp.length-1; cidx >= 0 ;cidx--) {
                        chk_cmp.splice(chk_idx, 0, rep_cmp[cidx]);
		    }
		}
	    }
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
    
    separate (elm) {
        try {
	    let fpath = elm.attrs.load;
            if (true === util.isComment(fpath)) {
                fpath = fpath.substring(1, fpath.length-1);
            }
            let prs_obj = this;
	    return new Promise(resolve => {
                fs.readFile(fpath, 'utf8',
                    (err,tag) => {
                        try {
                            if (undefined === tag) {
                                throw new Error("read file is failed:" + src);
                            }
                            resolve(new global.Parse(tag).parse());
                        } catch (e) {
                            console.error(e.stack);
                            throw e;
                        }
                    }
                );
            });
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }

    /**
     */
    convprs (prm) {
        try {
            let ret = {
                 setting   : { require: new Require(), access: null, rootConf: {} },
		 template  : [],
		 script    : [],
		 component : []
	    };

	    let prs_ret = mftree(
	        html_parser.parse(prm, { script: true, style: true }).childNodes
	    );

	    /* set return contents */
	    for (let pidx in prs_ret) {
	        if ("setting" === prs_ret[pidx].tag) {
		    for (let chd_idx in prs_ret[pidx].child) {
		        let chd = prs_ret[pidx].child[chd_idx];
		        if ("tag" === chd.tag) {
                            ret.setting.require.add(chd);
			} else if ("htmlStyle" === chd.tag) {
                            ret.setting.access = chd;
                        } else if ("rootConf" === chd.tag) {
			    ret.setting.rootConf = chd;
			}
		    }
		} else if ( ("script" === prs_ret[pidx].tag) ||
		            ("template" === prs_ret[pidx].tag) ) {
                    ret[prs_ret[pidx].tag].push(prs_ret[pidx]);
		} else {
                    ret.component.push(prs_ret[pidx]);
                }
            }
	    return ret;
	} catch (e) {
	    console.error(e.stack);
            throw e;
        }
    }
};
/* end of file */
