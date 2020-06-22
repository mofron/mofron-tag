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

/**
 * convert parsed object to script string
 */
module.exports = (prs) => {
    try {
        /* require */
	global.req = prs.setting.require;
        let ret = new Require(prs.setting.require.module()).toScript();
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
        ret += "\n" + new Template(prs.template).toScript();

	/* component */
	ret += "\n" + new global.gen.Module([get_root_cmp(prs)]).toScript();
        
        /* script (before) */
	scp.gencnf().type = "before";
        ret += "\n" + scp.toScript();
        
	ret += "\n    /* start visible */\n";
	scp.gencnf().type = "after";
	ret += "    root_cmp.visible(true,() => {try{\n\n" + scp.toScript();
	ret += "\n    }catch(e){console.error(e.stack);}});\n";
        ret += "} catch (e) {\n    console.error(e.stack);\n}\n";

	return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}


let get_root_cmp = (prs) => {
    try {
        let ret = {
            tag: 'div', attrs: prs.setting.rootConf.attrs,  cmp_cnt: 0,
            text: null, parent: null, name: "root_cmp"
        };
        ret.child = prs.component;
        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
};
/* end of file */
