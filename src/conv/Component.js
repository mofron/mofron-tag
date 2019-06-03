/**
 * @file Component.js
 * @brief component script generator
 * @author simparts
 */
const Base    = require('./BaseGen.js');
const DecComp = require('./dec/Component.js');
const DecTmpl = require('./dec/Template.js');
const Options = require('./Options.js');
const Child   = require('./Child.js');

module.exports = class extends Base {
    
    compCode (cmp_lst, tmpl, tag) {
        try {


            let ret  = "";
            let base = (undefined === tag) ? 'cmp' : tag + '_cmp';
            
            /* declare template */
            let dec_tmp = new DecTmpl({ minify: this.gencnf().minify });
            for (let tm_idx in tmpl) {
                dec_tmp.gencnf().name = tm_idx;
                ret += dec_tmp.toScript(tmpl[tm_idx]);
            }
            
            /* declare component */
            for (let cidx in cmp_lst) {
                let dec_cmp = new DecComp({
                    minify: this.gencnf().minify,
                    bsnm:   base + cidx + '_',
                    cmpgen: this
                });
                ret += dec_cmp.toScript(cmp_lst[cidx]);

//console.log(cmp_lst[cidx]);
//      console.log(ret);
            }
            
            /* struct area */
            let srctag = {};
            for (let sidx in this.gencnf().parse.srctag) {
                srctag[sidx] = this.gencnf().parse.srctag[sidx].component
            }
            for (let cidx2 in cmp_lst) {
                let chd_gen = new Child({
                    minify: this.gencnf().minify,
                    srctag: srctag
                });
                ret += chd_gen.toScript(cmp_lst[cidx2]);
            }
            /* option area */
            for (let cidx3 in cmp_lst) {
                let opt_gen = new Options({ minify: this.gencnf().minify });
                ret += opt_gen.toScript(cmp_lst[cidx3]);
            }
            
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    srcTag (cmp_lst, tag) {
        try {
            let ret = "";
            ret += this.compCode(cmp_lst, [], tag);
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    toScript (cmp_lst, tmpl) {
        try {
            this.add(this.compCode(cmp_lst, tmpl),0);
            /* return area */
            let buf = "";
            buf += "let set_comp=[";
            for (let cidx4 in cmp_lst) {
                buf += cmp_lst[cidx4].name + ",";
            }
            buf = buf.substring(0, buf.length-1);
            buf += "];";
            this.add(buf);
            
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
