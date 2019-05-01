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
            this.add("let isdef=[false,false];");
            this.add('let buf="";');
            this.add("if(null===document.body.getAttribute('style')){");
            this.add(    "isdef[0]=true;", 2);
            this.add(    "document.body.setAttribute('style','margin:0px;padding:0px;font-size:0.16em;');", 2);
            this.add("}");
            this.add("if(null===document.documentElement.getAttribute('style')){");
            this.add(    "isdef[1]=true;", 2);
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
            
            for (let aidx in prm.attrs) {
                if ( ("os" === aidx) || ("browser" === aidx)) {
                    continue;
                }
                ret += " and (" + aidx + ':' + prm.attrs[aidx] + ')';
            }
            if (true === util.isNumStr(prm.text)) {
                ret += '{' + "html{font-size:" + prm.text + "%;}}";
            } else {
                ret += '{' + prm.text + '}';
            }
            
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    addHead (prm, ind) {
        try {
            let media = this.getMedia(prm);
            let type  = "html";
            if (-1 !== media.indexOf("html")) {
                type = "html";
            } else if (-1 !== media.indexOf("body")){
                type = "body";   
            }
            
            if ("html" === type) {
                this.add("if(true===isdef[0]){", ind);
                this.add(    'document.documentElement.setAttribute("style","");', ind+1);
                this.add(    "mf.func.addHeadStyle('" + media +"');", ind+1);
                this.add("}else{", ind);
                this.add(    'buf=document.documentElement.getAttribute("style");', ind+1);
                this.add(    "mf.func.addHeadStyle('buf+" + media +"');", ind+1);
                this.add("}", ind);
            } else {
                this.add("if(true===isdef[1]){", ind);
                this.add(    'document.body.setAttribute("style","");', ind+1);
                this.add(    "mf.func.addHeadStyle('" + media +"');", ind+1);
                this.add("}else{", ind);
                this.add(    'buf=document.body.getAttribute("style");', ind+1);
                this.add(    "mf.func.addHeadStyle('buf+" + media +"');", ind+1);
                this.add("}", ind);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    addConts (prm, ind) {
        try {
            let atr = prm.attrs;
            if ((undefined !== atr.os) && (undefined !== atr.browser)) {
                this.add('if(("'+ atr.os +'"===mf.func.osType())&&("' + atr.browser + '"===mf.func.brsType())){', ind);
                this.addHead(prm, ind+1);
                this.add('}', ind); 
            } else if (undefined !== atr.os) {
                this.add('if("'+ atr.os +'"===mf.func.osType()){', ind);
                this.addHead(prm, ind+1);
                this.add('}', ind);
            } else if (undefined !== atr.browser) {
                this.add('if("'+ atr.browser +'"===mf.func.brsType()){', ind);
                this.addHead(prm, ind+1);
                this.add('}', ind);
            } else {
                this.addHead(prm, ind);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    toScript (prm) {
        try {
            let def_prm = "font-size:625%;";
            for (let pidx in prm) {
                if ('default' === prm[pidx].tag) {
                    def_prm = prm[pidx].text;
                    prm.splice(pidx, 1);
                    break;
                }
            }
            this.defStyle((true === util.isNumStr(def_prm)) ? "font-size:"+def_prm+"%;" : def_prm);
            
            let css_val = '';
            for (let pidx in prm) {
                if ( ("mobile" === prm[pidx].tag) ||
                     ("tablet" === prm[pidx].tag)) {
                    this.add('if ("'+ prm[pidx].tag +'"===mf.func.devType()){');
                    this.addConts(prm[pidx], 2);
                    this.add('}');
                } else if ('all' === prm[pidx].tag) {
                    this.addConts(prm[pidx], 1);
                } else {
                    this.add("if(window.navigator.userAgent.indexOf('" + prm[pidx].tag + "') > 0){");
                    this.addConts(prm[pidx], 2);
                    this.add('}');
                }
            }
            
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
