/**
 * @file config.js
 * @author simpart
 */
var loout  = require('./output.js');
var lopars = require('./parse.js');
var tmpl   = require('./template/component');
var thisobj = null;

try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }
    
    thisobj = {
        parse : function (tg) {
            try {
                let chd = lopars.filter(tg.children);
                if (null === chd) {
                    throw new Error("could not find child");
                }
                let cmp_str = "";
                for (let idx in chd) {
                    cmp_str += thisobj.component(chd[idx],3) + ",\n";
                }
                
                
                
                if (-1 === tmpl.indexOf("{ @component }")) {
                    throw new Error("invalid template");
                }
                
                tmpl = tmpl.replace(
                           "{ @component }",
                           "rc.child([\n" + cmp_str + "        ]);"
                );
                console.log(tmpl);
            } catch (e) {
                throw e;
            }
        },
        component : (cmp, ic) => {
            try {
                let ret = thisobj.indent(ic) + "new " + cmp.name + "({\n";
                let chd = lopars.filter(cmp.children);
                
                /* child */
                if (null !== chd) {
                    ret += thisobj.indent(ic+1) + "child : [\n";
                    for (let idx in chd) {
                        ret += thisobj.indent(ic+2) + thisobj.component(chd[idx]) + ",\n";
                    }
                    ret += thisobj.indent(ic+1) + "]\n";
                }
                
                ret += thisobj.indent(ic) + "})";
                return ret;
            } catch (e) {
                throw e;
            }
        },
        indent : (cnt) => {
            try {
                let base = "    ";
                let ret  = "";
                for (let loop=0; loop < cnt;loop++) {
                    ret += base;
                }
                return ret;
            } catch (e) {
                throw e;
            }
        }
    };
    
    module.exports = thisobj;
} catch (e) {
    throw e;
}
/* end of file */
