/**
 * @file Separate.js
 * @brief the data type as separated contents
 * @lisence MIT
 */

module.exports = class Separate {
    
    constructor (vl, nm) {
        try {
            this.value(vl);
	    this.name(nm);
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
            this.m_value = prm;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    name (prm) {
        try {
            if (undefined === prm) {
                return this.m_name;
	    }
	    this.m_name = prm;
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

}
/* end of file */
