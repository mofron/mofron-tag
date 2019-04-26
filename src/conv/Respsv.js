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
            this.add(    "document.documentElement.setAttribute('style','"+ prm +"');", 2);
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
    
    getTgtValue (prm, idx) {
        try {
            let ret     = [];
            let dup     = false;
            
            for (let chk_idx=parseInt(idx)-1; chk_idx >= 0 ;chk_idx--) {
                if ( (prm[idx].tag !== 'mobule') && (prm[idx].tag !== 'tablet') ) {
                    dup = true;
                    break;
                }
                if (prm[chk_idx].tag === prm[idx].tag) {
                    dup = true;
                    break;
                }
            }
            
            if ('body' === prm[idx].attrs.target) {
                if (true === dup) {
                    ret.push('buf=document.body.getAttribute("style");');
                    ret.push("mf.func.addHeadStyle(buf+'" + this.getMedia(prm[idx]) + "');");
                } else {
                    ret.push('document.body.setAttribute("style","");');
                    ret.push("mf.func.addHeadStyle('" + this.getMedia(prm[idx]) + "');");
                }
            } else {
                if (true === dup) {
                    ret.push('buf=document.documentElement.getAttribute("style");');
                    ret.push("mf.func.addHeadStyle(buf+'" + this.getMedia(prm[idx]) + "');");
                } else {
                    ret.push('document.documentElement.setAttribute("style","");');
                    ret.push("mf.func.addHeadStyle('" + this.getMedia(prm[idx]) + "');");
                }
            }
            
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

            this.add("let buf=null;");
            let css_val = '';
            for (let pidx in prm) {
                let tgt_val = this.getTgtValue(prm, pidx);
                
                if ( ("mobile" === prm[pidx].tag) ||
                     ("tablet" === prm[pidx].tag)) {
                    this.add('if ("'+ prm[pidx].tag +'"===mf.func.devType()){');
                    this.add(tgt_val[0], 2);
                    this.add(tgt_val[1], 2);
                    this.add('}');
                } else if ('screen' === prm[pidx].tag) {
                    css_val += this.getMedia(prm[pidx]);
                } else {
                    this.add("if(window.navigator.userAgent.indexOf('" + prm[pidx].tag + "') > 0){");
                    this.add(tgt_val[0], 2);
                    this.add(tgt_val[1], 2);
                    this.add('}');
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
