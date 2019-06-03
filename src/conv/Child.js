/**
 * @file Child.js
 * @brief component child method generator
 * @author simparts
 */
const Base = require('./BaseGen.js');
const util = require('../util.js');

let Child = class extends Base {
    
    template (tmp) {
        try {
            let ret = "";
            ret += tmp.attrs.name +"(";
            let prm = (1 < Object.keys(tmp.attrs).length) ? "{" : "";
            for (let aidx in tmp.attrs) {
                if ('name' === aidx) {
                    continue;
                }
                prm += aidx + ":";
                if ('string' === typeof tmp.attrs[aidx]) {
                    prm += tmp.attrs[aidx];
                } else {
                    if (true === util.isComment(tmp.attrs[aidx].text)) {
                        prm += tmp.attrs[aidx].text;
                    } else {
                        prm += '"' + tmp.attrs[aidx].text + '"';
                    }
                }
                prm += ",";
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
            if (true === cmp.src) {
                return this.m_script;
            }
            
            let buf  = "";
            let name = [];
            for (let cidx in cmp.child) {
                if (false === cmp.child[cidx].src) {
                    name.push(cmp.child[cidx].name);
                } else {
                    for (let sidx in this.gencnf().srctag[cmp.child[cidx].tag]) {
                        name.push(
                            this.gencnf().srctag[cmp.child[cidx].tag][sidx].name
                        );
                    }
                }
                
                buf += new Child({
                    minify: this.gencnf().minify,
                    srctag: this.gencnf().srctag
                }).toScript(cmp.child[cidx]);
            }
            /* add child name */
            let add_scp = '';
            for (let nidx in name) {
                add_scp += name[nidx] + ',';
            }
            if ('' !== add_scp) {
                add_scp = add_scp.substring(0, add_scp.length-1);
                this.add(cmp.name + ".child([" + add_scp + "]);");
            }
            
            if (undefined !== cmp.attrs.template) {
                if (false === Array.isArray(cmp.attrs.template)) {
                    this.add(cmp.name + ".child(" + this.template(cmp.attrs.template) + ");");
                } else {
                    for (let tidx in cmp.attrs.template) {
                        this.add(cmp.name + ".child(" + this.template(cmp.attrs.template[tidx]) + ");");
                    }
                }
            }
            /* add child script of cmp.child */
            return this.m_script + buf;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
module.exports = Child;
/* end of file */
