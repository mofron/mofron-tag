/**
 * @file BaseGen.js
 * @brief base generator
 * @author simparts
 */

module.exports = class {
    constructor (opt) {
        try {
            this.m_gencnf = {
                minify: false
            };
            this.gencnf(opt);
            this.m_script = "";
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    add (scp, idt) {
        try {
            if ('string' !== typeof scp) {
                throw new Error('invalid parameter');
            }
            let _idt = (undefined === idt) ? 1 : idt;
            if (0 !== _idt) {
                this.indent(_idt, scp);
            } else {
                this.m_script += scp;
            }
            if (false === this.gencnf().minify) {
                this.m_script += "\n";
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    indent (cnt, scp) {
        try {
            if ((1 > cnt) || ('string' !== typeof scp)) {
                throw new Error('invalid parameter');
            }
            if (false === this.gencnf().minify) {
                let idt_str = "";
                for (let i=0;i<cnt;i++) {
                    idt_str += "    ";
                }
                this.m_script += idt_str + scp;
            } else {
                this.m_script += scp;
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    gencnf (prm) {
        try {
            if (undefined === prm) {
                /* getter */
                return this.m_gencnf;
            }
            for (let pidx in prm) {
                this.m_gencnf[pidx] = prm[pidx];
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    toScript () { /* interface */ }
}
/* end of file */
