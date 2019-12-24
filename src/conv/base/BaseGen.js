/**
 * @file BaseGen.js
 * @brief base generator
 * @author simparts
 */
module.exports = class {
    constructor (prm, opt) {
        try {
            this.m_gencnf = {
                minify: false,
		defidt: 1,
		comment: null
            };
            this.gencnf(opt);

            this.m_script = "";
	    this.param(prm);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    param (prm) {
        try {
            if (undefined === prm) {
                return this.m_param;
	    }
	    this.m_param = prm;
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
            let _idt = (undefined === idt) ? this.gencnf().defidt : idt;
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
    
    toScript () {
        try {
            if (null !== this.gencnf().comment) {
	        this.add("/* "+ this.gencnf().comment +" */");
            }
	} catch (e) {
	    console.error(e.stack);
	    throw e;
	}
    }
}
/* end of file */
