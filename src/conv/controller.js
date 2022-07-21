/**
 * @file ./conv/ctrl.js
 * @brief converter controller
 */
const Require  = require('./Require.js');
const Access   = require('./Access.js');
const Template = require('./Template.js');
const Script   = require('./Script.js');


global.req  = null;
global.gen  = {
    Declare: require('./base/Declare.js'),
    Module: require('./module/Module.js'),
    Config: require('./module/Config.js')
}
global.mod = { dec: [], conf: [], child: [], count: 0 };
global.module = null;

/**
 * convert parsed object to script string
 */
module.exports = (prs) => {
    try {
        /* require */
	let ret = "( async () => {\n";
	global.req = prs.setting.require;
        ret += new Require(prs.setting.require.module()).toScript();
        ret += "const comutl=mofron.util.common;\n";
	ret += "const cmputl=mofron.util.component;\n";
        ret += "try {\n";
        
        /* access */
	if (null !== prs.setting.access) {
	    ret += new Access(prs.setting.access).toScript();
        }
        
	let scp = new Script(prs.script);
        /* script (extern) */
        ret += "\n" + scp.toScript("extern");
        
        /* script (init) */
	scp.gencnf().type = "init";
	ret += "\n" + scp.toScript();
        
        /* template */
	let tmpl = new Template(prs.template);
	global.module = tmpl;
        ret += "\n" + tmpl.toScript();
        
	/* component */
        global.module = new global.gen.Module([get_root_cmp(prs)]);
        ret += "\n" + global.module.toScript();
        
        /* script (before) */
        scp.gencnf().type = "before";
        ret += "\n" + scp.toScript();
        
	ret += "\n    /* start visible */\n";
	ret += "mofron.root.push(root_cmp);\n";
	scp.gencnf().type = "after";
	ret += "    root_cmp.visible(true,() => {try{\n\n" + scp.toScript();
	ret += "\n    }catch(e){console.error(e.stack);}});\n";
        ret += "} catch (e) {\n    console.error(e.stack);\n}\n";
        ret += "} )();";

	return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}


let get_root_cmp = (prs) => {
    try {
        let ret = {
            tag: 'div',
	    attrs: (undefined === prs.setting.rootConf.attrs) ? {} : prs.setting.rootConf.attrs,
	    cmp_cnt: 0,
            text: null, parent: null, name: "root_cmp"
        };
	
	/* update parent */
        for (let ridx in ret.attrs) {
	    if (("object" === typeof ret.attrs[ridx]) && (undefined !== ret.attrs[ridx].parent)) {
                ret.attrs[ridx].parent = ret;
	    }
        }
        ret.child = prs.component;
        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
};
/* end of file */
