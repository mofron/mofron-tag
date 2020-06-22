#!/usr/bin/env node
/**
 * @file index.js
 * @brief mofron-tag command
 * @author simparts
 */
const fs = require('fs');
const Parser = require('./src/parse/Parser.js');
const sort = require('./src/parse/sort.js');
const mfconverter = require('./src/conv/controller.js');

global.Parse  = Parser;
global.parse  = null;
global.load   = 0;
global.mfpath = null;

let exec_load = (src) => {
    try {
        return new Promise(resolve => {
	    fs.readFile(src, 'utf8',
                (err,tag) => {
                    try {
                        if (undefined === tag) {
                            throw new Error("read file is failed:" + src);
                        }
                        resolve(new Parser(tag).parse());
		    } catch (e) {
                        console.error(e.stack);
			throw e;
		    }
		}
	    );
	});
    } catch (e) {
        console.error(e.stack);
	throw e;
    }
}


let exec = async () => {
    try {
        /* load mofron tag */
	let mof = null;
	global.mfpath = (3 > process.argv.length) ? './mof/index.mf' : process.argv[2];
        await exec_load(global.mfpath);
	await sort(global.parse.component);
        await sort(global.parse.template);
        if (0 < Object.keys(global.parse.setting.rootConf).length) {
	    await sort([global.parse.setting.rootConf]);
        }

	let js = mfconverter(global.parse);
        
	/* write converted js code */
	if (4 > process.argv.length) {
	    console.log(js);
	} else if (4 === process.argv.length) {
            fs.writeFile(
	        process.argv[3], js,
		(err) => { if (null !== err) console.log(err); }
	    );
	}
    } catch (e) {
        console.error(e.stack);
	throw e;
    }
};
exec();
/* end of file */
