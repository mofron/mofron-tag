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
                    this.separate(req_elm);
		} else {
                    this.module(req_elm);
		}
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
	    this.m_module.push(prm);
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
    
    separate (prm) {
        try {
            if (undefined === prm) {
                /* getter */
		return this.m_separate;
	    }
	    /* setter */
	    this.m_separate.push(prm);
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
	    let sep = this.separate();
	    for (let sidx in sep) {
                if (tag === sep[sidx].text) {
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
	    for (let midx in mod) {
	        if (prm !== mod[midx].text) {
                    continue;
		}
	        sp_load = mod[midx].attrs.load.split('-');
		if (3 !== sp_load.length) {
                    continue;
		}
		let type = sp_load[1];
		if ("comp" === type) {
                    return "cmp";
		} else if ("event" === type) {
                    return "evt";
		} else if ("effect" === type) {
                    return "eff";
		}
	    }
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
}
/* end of file */
