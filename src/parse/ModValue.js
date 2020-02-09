/**
 * @file ./perser/ModValue.js
 * @brief module value object
 * @author simparts
 */

module.exports = class ModValue {
    
    constructor (nm, prm) {
        try {
            if (undefined === nm) {
                throw new Error('invalid parameter');
	    }

	    this.name(nm);
	    this.value((undefined === prm) ? '' : prm);
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }

    name (prm) {
        try {
            if (undefined === prm) {
                /* getter */
	        return this.m_name;
            }
	    /* setter */
            this.m_name = prm;
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
