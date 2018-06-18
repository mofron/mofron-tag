/**
 * @file error.js
 */

module.exports = {

    usage : function() {
        console.log("usage : mofron-tag <target file path>\n");
        throw new Error('invalid target file');
    }
}
/* end of file */
