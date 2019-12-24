/**
 * @file ./conv/ctrl.js
 * @brief converter controller
 */
const Require   = require('./Require.js');
const Access    = require('./Access.js');
const Component = require('./component/Component.js');
const Template  = require('./Template.js');
const Script    = require('./Script.js');

/**
 * convert parsed object to script string
 */
module.exports = (prs) => {
    try {
        /* require */
        let ret = new Require(prs.require.module()).toScript();
        
        ret += "try {\n";
        
        /* access */
	if (null !== prs.access) {
	    ret += new Access(prs.access).toScript();
        }
        
        /* script (init[default]) */
	let scp = new Script(prs.script);
	scp.gencnf().type = "init";
	ret += "\n" + scp.toScript();
        
        /* template */
        ret += "\n" + new Template(prs.template).toScript();
        
	/* component */
        ret += "\n" + new Component(prs.component).toScript();
        
        /* script (before) */
	scp.gencnf().type = "before";
        ret += "\n" + scp.toScript();
        //ret += "\n" + new Script(prs.script, {type: "before"}).toScript();
        
	ret += "\n    /* start visible */\n";
	for (let cidx=1; cidx < prs.component.length ;cidx++) {
            ret += "    " + prs.component[cidx].name + ".visible(true);\n";
	}
	ret += "    " + prs.component[(prs.component.length)-1].name + ".visible(true";
	scp.gencnf().type = "after";
        ret += ",() => {try{\n\n" + scp.toScript();
	ret += "\n    }catch(e){console.error(e.stack);}});\n";
        ret += "} catch (e) {\n    console.error(e.stack);\n}\n";
        
	return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}
/* end of file */
