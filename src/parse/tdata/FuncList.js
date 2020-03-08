/**
 * @file ./perser/FuncList.js
 * @brief object for defined tag data type
 * @license MIT
 */
module.exports = class FuncList {
    
    constructor (vl,tg,aidx) {
        try {
            this.value(vl);
	    this.tag(tg);
	    this.attrName(aidx);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    addValue (prm) {
        try {
	    this.value().push(prm);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

    value (prm) {
        try {
            if (undefined === prm) {
                /* getter */
                return this.m_value;
            }
            /* setter */
	    if (undefined === this.m_value) {
                this.m_value = [];
	    }
            this.m_value.push(prm);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    tag (prm) {
        try {
            if (undefined === prm) {
                /* getter */
		return this.m_tag;
	    }
	    /* setter */
	    if ("object" !== typeof prm) {
                throw new Error("invalid parameter");
	    }
	    this.m_tag = prm;
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    attrName (prm) {
        try {
            if (undefined === prm) {
	        /* getter */
                return this.m_aname;
	    }
	    /* setter */
	    if ("string" !== typeof prm) {
                throw new Error("invalid parameter");
	    }
            this.m_aname = prm;
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }
}

