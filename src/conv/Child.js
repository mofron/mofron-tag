/**
 * @file Child.js
 * @brief component child method generator
 * @author simparts
 */
const Base = require('./BaseGen.js');

module.exports = class extends Base {
    
    template (tmp) {
        try {
            let ret = "";
            ret += tmp.attrs.name +"(";
            let prm = (1 < Object.keys(tmp.attrs).length) ? "{" : "";
            for (let aidx in tmp.attrs) {
                if ('name' === aidx) {
                    continue;
                }
                prm += aidx + ":" + tmp.attrs[aidx] + ",";
            }
            prm = (1 < Object.keys(tmp.attrs).length) ? prm.substring(0, prm.length-1) + "}" : "";
            return ret + prm + ")";
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    toScript (cmp) {
        try {
            let ret  = (0 < cmp.child.length) ? cmp.name + ".child([" : "";
            let buf  = "";
            let name = [];
            for (let cidx in cmp.child) {
                name.push(cmp.child[cidx].name);
                buf += this.toScript(cmp.child[cidx]);
            }
            for (let nidx in name) {
                ret += name[nidx] + ',';
            }
            if (0 < cmp.child.length) {
                ret = (false === this.gencnf().minify) ? "    " + ret : ret;
                ret = ret.substring(0, ret.length-1) + "]);";
                ret += (false === this.gencnf().minify) ? "\n" : "";
            }
            if (undefined !== cmp.attrs.template) {
                ret = (false === this.gencnf().minify) ? "    " + ret : ret;
                ret += cmp.name + ".child(" + this.template(cmp.attrs.template) + ");";
                ret += (false === this.gencnf().minify) ? "\n" : "";
            }
            return ret + buf;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
