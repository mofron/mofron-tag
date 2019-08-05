/**
 * @file TagOpt.js
 * @brief option with tagging script generator
 * @author simparts
 */
const Options = require('../Options.js');
const Style   = require('../opt/Style.js');
const util    = require('../../util.js');

let get_tag = (prm) => {
    try {
        if (true === util.isComment(prm)) {
            return ('@' === prm[1]) ? '@p.' + prm.substring(2, prm.length-1) : null;
        } else if ( ('@' === prm[0]) && ('@' === prm[1]) ) {
            return '@' + prm.substring(2);
        }
        
        return ('@' === prm[0]) ? '@p.' + prm.substring(1) : null;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

module.exports = class extends Options {
   
    constructor (opt) {
        try {
            super(opt);
            this.gencnf().autoComment = false;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    width (prm) {
        try { return this._otheropt(prm); } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    style (prm) {
        try {
            return new Style({
                minify: true, optflg: false
            }).toScript(prm);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    name (prm) {
        try {
            let tag = get_tag(prm);
            return super.name((null !== tag) ? tag.substring(1) : prm);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
//    otheropt (nm, prm) {
//        try {
//            let ret = "";
///            if ('string' === typeof prm) {
//                ret += nm + ":";
//                if ( (false === isComment(prm)) &&
//                     ('number' !== typeof prm) &&
//                     (null !== prm.match(/\w+[(].*[)]/g)) ) {
//                    ret += 'new ';
//                }
//                ret += prm;
//            } else if (true === Array.isArray(prm)) {
//                ret += nm + ':[';
//                for (let vidx in prm) {
//                    if ( (false === isComment(prm[vidx])) &&
//                         ('number' !== typeof prm[vidx]) &&
//                         (null !== prm[vidx].match(/\w+[(].*[)]/g)) ) {
//                        ret += 'new ';
//                    }
//                    ret += prm[vidx]+',' ;
//                }
//                ret = ret.substring(0, ret.length-1);
//                ret += ']';
//            } else if ('object' === typeof prm) {
//                let ret = nm + ":";
//                ret += (1 < prm.attrs.length) ? "[" : "";
//                for (let aidx in prm) {
//                    ret += "new " + aidx + "(";
//                    ret += this.optgen(prm.attrs[aidx]) + ")";
//                }
//                ret += (1 < prm.length) ? "]" : "";
//            } else {
//                throw new Error('unknown attrs:' + aidx);
//            }
//            return ret;
//        } catch (e) {
//            console.error(e.stack);
//            throw e;
//        }
//    }
    
    _otheropt (prm) {
        try {
           if ( ('string' === typeof prm) && ('@' === prm[0])) {
               prm = get_tag(prm);
           }
           return super._otheropt(prm); 
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    _optgen (cmp) {
        try {
            if (null !== cmp.text) {
                let tag = get_tag(cmp.text);
                cmp.text = (null !== tag) ? tag : cmp.text;
                return super._optgen(cmp);
            }
            return super._optgen(cmp);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
