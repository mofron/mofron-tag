/**
 * @file ./Parser.js
 * @brief tag perse controller for mofron
 *        read tag file, sort some objects for converver
 * @author simparts
 */
const fs = require('fs')
const html_parser = require('node-html-parser');
const Require = require('./Require.js');
const mftree = require('./tree.js');
const util = require('../util.js');

module.exports = class {
    
    constructor (txt) {
        try {
	    this.m_tagtxt = txt;
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }

    getReturn () {
        return this.m_return;
    }
    
    async parse () {
        try {
            this.m_return = this.convprs(this.m_tagtxt);
	    /* load mofron tag contents that are separated file */
            let sep = this.m_return.require.separate();
	    for (let sidx in sep) {
                await this.separate(sep[sidx]);
	    }
            /* load script contents that are separated file */
	    for (let sidx in this.m_return.script) {
	        let scp = this.m_return.script[sidx];
	        if (undefined !== scp.attrs.src) {
	            await this.loadScript(scp);
		} 
            }
            return this.m_return;
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
    
    loadScript (scp) {
        try {
	    return new Promise(resolve => {
                try {
		    let src = scp.attrs.src;
		    if (undefined === src) {
                        resolve();
                    }
		    let path = process.cwd() + '/' + src.substring(1, src.length-1);
                    fs.readFile(
		        path, 'utf8',
		        (err, cnt) => {
                            try {
                                if (undefined === cnt) {
                                    throw new Error("load script is failed:" + path);
				}
				let sp_cnt = cnt.split('\n');
				let txt    =  "";
				for (let sp_idx in sp_cnt) {
                                    txt += sp_cnt[sp_idx];
				}
				scp.text = txt;
				resolve();
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
	    });
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
            let thisobj = this;
	    return new Promise(resolve => {
                fs.readFile(src, 'utf8',
                    (err,tag) => {
                        try {
                            if (undefined === tag) {
                                throw new Error("read file is failed:" + src);
                            }
                            let prs = thisobj.convprs(tag);
                            let ret_obj = thisobj.getReturn();
                            /* add modules */
                            let mod = prs.require.module();
                            for (let midx in mod) {
                                ret_obj.require.module(mod[midx]);
                            }
                            /* add template */
                            for (let tidx in prs.template) {
                                ret_obj.template.push(prs.template[tidx]);
                            }
                            /* add script */
                            for (let sidx in prs.script) {
                                ret_obj.script.push(prs.script[sidx]);
                            }
                            /* add component */
                            thisobj.repcomp(elm.text, ret_obj.component, prs.component);
                            
                            /* load contents that are separated file */
                            let sep = prs.require.separate();
                            for (let sidx in sep) {
                                thisobj.separate(sep[sidx]);
                            }
                            resolve();
                            //resolve(new Parser(tag).parse());
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
                 require   : new Require(),
		 access    : null,
		 template  : [],
		 script    : [],
		 component : []
	    };

	    let prs_ret = mftree(
	        html_parser.parse(prm, { script: true, style: true }).childNodes
	    );

	    /* set return contents */
	    for (let pidx in prs_ret) {
	        if ('require' === prs_ret[pidx].tag) {
		    for (let chd_idx in prs_ret[pidx].child) {
		        ret.require.add(prs_ret[pidx].child[chd_idx]);
		    }
		} else if ( ('script' === prs_ret[pidx].tag) ||
		            ('template' === prs_ret[pidx].tag) ) {
                    ret[prs_ret[pidx].tag].push(prs_ret[pidx]);
		} else if ('accessStyle' === prs_ret[pidx].tag) {
		    ret.access = prs_ret[pidx];
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
