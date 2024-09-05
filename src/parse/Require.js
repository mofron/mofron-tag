/**
 * @file ./perser/Require.js
 * @brief parse require tag
 * @author simparts
 */
const fs = require('fs');
const util = require('../util.js');

module.exports = class Require {
    
    constructor (tag) {
        try {
	    /* init member */
	    this.m_module   = [];
            this.m_separate = [];
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
    
    add (req_elm) {
        try {
	    if ('tag' !== req_elm.tag) {
                throw new Error('invalid tag name:' + req_elm.tag);
	    }
	    
            let atr = req_elm.attrs;
            if (undefined !== atr.module) {
		/* old style */
		atr.load = atr.module;
                this.module(req_elm);
	    } else if (undefined !== atr.load) {
	        let chk_file = atr.load;
                if (true === util.isComment(atr.load)) {
		    chk_file = atr.load.substring(1, atr.load.length-1);
		}
                
                if (true === fs.existsSync(chk_file)) {
		    let add_load = ("." === chk_file[0]) ? "." : "..";
                    req_elm.attrs.load = add_load + chk_file;
		}
                this.module(req_elm);
            } else {
                throw new Error('unknown attribute');
	    }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    module (prm) {
        try {
            if (undefined === prm) {
                /* getter */
		return this.m_module;
	    }
	    /* setter */
	    for (let midx in this.m_module) {
                if (prm.attrs.load === this.m_module[midx].attrs.load) {
                    return;
		}
	    }
	    this.m_module.push(prm);
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
    
    repsep (prm) {
        try {
	    for (let sidx in this.m_separate) {
                if (prm.name() === this.m_separate[sidx].text) {
                    this.m_separate[sidx] = prm;
		    return;
		}
	    }
            throw new Error("could not find seperate");
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

    isExists (tag) {
        try {
	    let mod = this.module();
            for (let midx in mod) {
                if (tag === mod[midx].text) {
                    return true;
		}
	    }
	    return false;
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }

    getType (prm) {
        try {
            if (false === this.isExists(prm)) {
                throw new Error(prm+' is not exists');
	    }
	    let mod     = this.module();
	    let sp_load = null;
	    let ret_lst = {
	        "comp": "cmp",
		"event": "evt",
		"effect": "eff",
		"layout": "lot"
            };

	    for (let midx in mod) {
	        if (prm !== mod[midx].text) {
                    continue;
		}

	        sp_load = mod[midx].attrs.load.split('-');
		if (3 !== sp_load.length) {
                    return "user";
                }
		let type = sp_load[1];
		return ret_lst[type];
	    }
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
}
/* end of file */
