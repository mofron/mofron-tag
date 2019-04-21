/**
 * @file Respsv.js
 * @brief responsive script genelator
 * @author simparts
 */
const Base = require('./BaseGen.js');
const util = require('../util.js');

module.exports = class extends Base {
    
    defStyle (prm) {
        try {
            this.add("if(null===document.body.getAttribute('style')){");
            this.add(    "document.body.setAttribute('style','margin:0px;padding:0px;font-size:0.16em;');", 2);
            this.add("}");
            this.add("if(null===document.documentElement.getAttribute('style')){");
            this.add(    "document.documentElement.setAttribute('style','"+ prm +";');", 2);
            this.add("}");
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    getMedia (prm) {
        try {
            let ret = "@media screen";
            /* check target type */
            let tp = "html";
            for (let pidx in prm.attrs) {
                if ("target" === pidx) {
                    tp = prm.attrs[pidx];
                    delete prm.attrs.target;
                    break;
                }
            }
            
            for (let pidx2 in prm.attrs) {
                ret += " and (" + pidx2 + ":" + prm.attrs[pidx2] + ")";
            }
            
            ret += "{" + tp + "{" + prm.text + "}}";
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    toScript (prm) {
        try {
            let def_prm = undefined;
            for (let pidx in prm) {
                if ('default' === prm[pidx].tag) {
                    def_prm = prm[pidx].text;
                    prm.splice(pidx, 1);
                    break;
                }
            }
            this.defStyle(def_prm);
            let css_val = '';
            for (let pidx in prm) {
                let fnt_siz = "html{font-size:" + prm[pidx].text + "%;}}";
                let base    = "@media screen";
                
                if ( ('mobile' === prm[pidx].tag) ||
                     ('tablet' === prm[pidx].tag)) {
                    this.add('if ("'+ prm[pidx].tag +'"===mf.func.devType()){');
                    if ('body' === prm[pidx].attrs.target) {
                        this.add(    "document.body.setAttribute('style','');", 2);
                        this.add(    "mf.func.addHeadStyle('" + this.getMedia(prm[pidx]) + "')",2);
                    } else {
                        this.add(    "document.documentElement.setAttribute('style','');", 2);
                        this.add(    "mf.func.addHeadStyle('" + this.getMedia(prm[pidx]) + "')",2);
                    }
                    this.add('}');
                    
                } else if ('screen' === prm[pidx].tag) {
                    css_val += this.getMedia(prm[pidx]);
                } else {
                    throw new Error('invalid tag:' + prm[pidx].tag);
                }
            }
            if ('' !== css_val) {
                this.add("mf.func.addHeadStyle('" + css_val + "')");
            }
            
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
