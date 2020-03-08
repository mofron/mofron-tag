/**
 * @file ./perser/TagData.js
 * @brief object for defined tag data type
 * @license MIT
 */

module.exports = class ConfArg {
    
    constructor (vl) {
        try {
            this.value(vl);
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

