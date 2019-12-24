/**
 * @file ./perser/Require.js
 * @brief parse require tag
 * @author simparts
 */

module.exports = class ConfArg {
    
    constructor (prm) {
        try {
	    this.value(prm);
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
}
/* end of file */
