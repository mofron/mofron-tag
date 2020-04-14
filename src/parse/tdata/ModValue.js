/**
 * @file ./perser/ModValue.js
 * @brief module value object
 * @license MIT
 */
const ConfArg = require("./ConfArg.js");

module.exports = class ModValue extends ConfArg {
    
    constructor (nm, prm) {
        try {
	    super(prm);

            if (undefined === nm) {
                throw new Error('invalid parameter');
	    }

	    this.name(nm);
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
	    if ("string" !== typeof prm) {
                throw new Error("invalid parameter");
	    }
            this.m_name = prm;
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
